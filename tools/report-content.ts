import { statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ESLint } from "eslint";
import { execa } from "execa";
import { globby } from "globby";
import matter, { type GrayMatterFile } from "gray-matter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import type { Link, Root } from "mdast";

const workspaceRoot = path.resolve(process.cwd());
const reportsDir = path.join(workspaceRoot, "reports");

const ignoredPatterns = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.git/**",
  "**/.husky/**",
  "**/supabase/.temp/**",
  "**/reports/**",
];

type MarkdownReport = {
  file: string;
  frontMatter: "present" | "missing";
  brokenLinks: string[];
  frontMatterError?: string;
};

type JsonReport = {
  file: string;
  valid: boolean;
  error?: string;
};

type EslintMessage = {
  file: string;
  messages: {
    ruleId: string | null;
    message: string;
    severity: "error" | "warning";
    line: number;
    column: number;
  }[];
};

type CSpellIssuePayload = {
  filename: string;
  line?: number;
  column?: number;
  suggestions?: string[];
  text: string;
};

type CSpellJsonEntry = {
  issues?: CSpellIssuePayload[];
};

type SpellingIssue = {
  file: string;
  line: number;
  column: number;
  suggestions: string[];
  text: string;
};

type ContentReport = {
  generatedAt: string;
  markdown: {
    issues: MarkdownReport[];
    stats: {
      total: number;
      missingFrontMatter: number;
      frontMatterErrors: number;
      brokenLinks: number;
    };
  };
  json: {
    issues: JsonReport[];
    stats: {
      total: number;
      invalid: number;
    };
  };
  eslint: {
    issues: EslintMessage[];
    stats: {
      filesWithIssues: number;
      totalErrors: number;
      totalWarnings: number;
    };
  };
  spelling: {
    issues: SpellingIssue[];
    stats: {
      totalIssues: number;
      filesWithIssues: number;
    };
  };
};

function isRelativeLink(url: string): boolean {
  if (!url) {
    return false;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return false;
  }
  if (url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return false;
  }
  return !path.isAbsolute(url);
}

async function analyzeMarkdown(): Promise<MarkdownReport[]> {
  const files = await globby(["**/*.md", "**/*.mdx"], {
    cwd: workspaceRoot,
    ignore: ignoredPatterns,
  });

  const processor = unified<Root>().use(remarkParse).use(remarkFrontmatter, ["yaml", "toml"]).use(remarkGfm);

  const reports: MarkdownReport[] = [];

  for (const relativePath of files) {
    const absolutePath = path.join(workspaceRoot, relativePath);
    const raw = await readFile(absolutePath, "utf8");

    let parsed: GrayMatterFile<string>;
    let frontMatterError: string | undefined;

    try {
      parsed = matter(raw);
    } catch (error) {
      frontMatterError = error instanceof Error ? error.message : String(error);
      parsed = { content: raw, data: {} } as GrayMatterFile<string>;
    }

    const hasFrontMatter = !frontMatterError && Object.keys(parsed.data ?? {}).length > 0;
    const brokenLinks: string[] = [];
    const ast = processor.parse(parsed.content);

    visit<Root, 'link'>(ast, 'link', (node: Link) => {
      const url = node.url ?? '';
      if (!isRelativeLink(url)) {
        return;
      }
      const linkPath = url.split("#")[0];
      if (!linkPath) {
        return;
      }
      const targetPath = path.normalize(path.join(path.dirname(absolutePath), linkPath));
      try {
        const stat = statSync(targetPath);
        if (!stat.isFile() && !stat.isDirectory()) {
          brokenLinks.push(url);
        }
      } catch {
        brokenLinks.push(url);
      }
    });

    reports.push({
      file: relativePath,
      frontMatter: hasFrontMatter ? "present" : "missing",
      brokenLinks,
      frontMatterError,
    });
  }

  return reports;
}

async function analyzeJson(): Promise<JsonReport[]> {
  const files = await globby(["**/*.json"], {
    cwd: workspaceRoot,
    ignore: [...ignoredPatterns, "package-lock.json"],
  });

  const results: JsonReport[] = [];

  for (const relativePath of files) {
    const absolutePath = path.join(workspaceRoot, relativePath);
    try {
      const raw = await readFile(absolutePath, "utf8");
      JSON.parse(raw);
      results.push({ file: relativePath, valid: true });
    } catch (error) {
      results.push({
        file: relativePath,
        valid: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  return results;
}

async function analyzeEslint(): Promise<EslintMessage[]> {
  const eslint = new ESLint({ cwd: workspaceRoot, extensions: [".ts", ".tsx"] });
  const results = await eslint.lintFiles(["src/**/*.{ts,tsx}"]);
  const issues: EslintMessage[] = [];

  for (const result of results) {
    if (result.errorCount === 0 && result.warningCount === 0) {
      continue;
    }

    issues.push({
      file: path.relative(workspaceRoot, result.filePath),
      messages: result.messages.map((message) => ({
        ruleId: message.ruleId,
        message: message.message,
        severity: message.severity === 2 ? "error" : "warning",
        line: message.line,
        column: message.column,
      })),
    });
  }

  return issues;
}

async function analyzeSpelling(): Promise<SpellingIssue[]> {
  const result = await execa("npx", [
    "cspell",
    "--config",
    "cspell.config.cjs",
    "--no-color",
    "--no-progress",
    "--show-context",
    "--json",
    "**/*.{md,mdx,ts,tsx,json}",
  ], {
    cwd: workspaceRoot,
    reject: false,
  });

  if (!result.stdout.trim()) {
    return [];
  }

  const issues: SpellingIssue[] = [];
  const lines = result.stdout.split("\n").map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    try {
      const payload = JSON.parse(line) as CSpellJsonEntry;
      if (!payload.issues || !Array.isArray(payload.issues)) {
        continue;
      }
      for (const issue of payload.issues) {
        issues.push({
          file: issue.filename,
          line: issue.line ?? 0,
          column: issue.column ?? 0,
          suggestions: issue.suggestions ?? [],
          text: issue.text,
        });
      }
    } catch (error) {
      console.warn("[cspell] No se pudo interpretar la línea:", line, error);
    }
  }

  return issues;
}

function buildMarkdown(report: ContentReport): string {
  const lines: string[] = [];

  lines.push(`# Informe de consistencia (${report.generatedAt})`);
  lines.push("");

  lines.push("## Markdown");
  lines.push(
    `Total: ${report.markdown.stats.total} · Sin front-matter: ${report.markdown.stats.missingFrontMatter} · Errores front-matter: ${report.markdown.stats.frontMatterErrors} · Enlaces rotos: ${report.markdown.stats.brokenLinks}`,
  );
  lines.push("");
  if (report.markdown.issues.length === 0) {
    lines.push("- No se encontraron incidencias en Markdown.");
  } else {
    for (const issue of report.markdown.issues) {
      const problems: string[] = [];
      if (issue.frontMatter === "missing") {
        problems.push("sin front-matter");
      }
      if (issue.frontMatterError) {
        problems.push(`error front-matter (${issue.frontMatterError})`);
      }
      if (issue.brokenLinks.length > 0) {
        problems.push(`enlaces rotos (${issue.brokenLinks.join(', ')})`);
      }
      if (problems.length > 0) {
        lines.push(`- ${issue.file}: ${problems.join(' · ')}`);
      }
    }
  }
  lines.push("");

  lines.push("## JSON");
  lines.push(`Total: ${report.json.stats.total} · Inválidos: ${report.json.stats.invalid}`);
  lines.push("");
  const invalidJson = report.json.issues.filter((entry) => !entry.valid);
  if (invalidJson.length === 0) {
    lines.push("- Todos los JSON son válidos.");
  } else {
    for (const entry of invalidJson) {
      lines.push(`- ${entry.file}: ${entry.error}`);
    }
  }
  lines.push("");

  lines.push("## ESLint");
  lines.push(
    `Archivos con incidencias: ${report.eslint.stats.filesWithIssues} · Errores: ${report.eslint.stats.totalErrors} · Warnings: ${report.eslint.stats.totalWarnings}`,
  );
  lines.push("");
  if (report.eslint.issues.length === 0) {
    lines.push("- Sin problemas reportados por ESLint.");
  } else {
    for (const entry of report.eslint.issues) {
      const messages = entry.messages
        .map(
          (message) =>
            `L${message.line}:C${message.column} [${message.severity}] ${message.message}${message.ruleId ? ` (${message.ruleId})` : ''}`,
        )
        .join(" | ");
      lines.push(`- ${entry.file}: ${messages}`);
    }
  }
  lines.push("");

  lines.push("## Ortografía (cspell)");
  lines.push(
    `Faltas detectadas: ${report.spelling.stats.totalIssues} · Archivos afectados: ${report.spelling.stats.filesWithIssues}`,
  );
  lines.push("");
  if (report.spelling.issues.length === 0) {
    lines.push("- Sin incidencias de ortografía.");
  } else {
    for (const issue of report.spelling.issues) {
      const suggestions = issue.suggestions.length > 0 ? ` · Sugerencias: ${issue.suggestions.join(', ')}` : "";
      lines.push(`- ${issue.file} (L${issue.line}:C${issue.column}) · "${issue.text}"${suggestions}`);
    }
  }

  return lines.join("\n");
}

async function ensureReportsDir() {
  await mkdir(reportsDir, { recursive: true });
}

async function main() {
  await ensureReportsDir();

  const [mdIssues, jsonIssues, eslintIssues, spellingIssues] = await Promise.all([
    analyzeMarkdown(),
    analyzeJson(),
    analyzeEslint(),
    analyzeSpelling(),
  ]);

  const markdownStats = {
    total: mdIssues.length,
    missingFrontMatter: mdIssues.filter((issue) => issue.frontMatter === "missing").length,
    frontMatterErrors: mdIssues.filter((issue) => Boolean(issue.frontMatterError)).length,
    brokenLinks: mdIssues.reduce((acc, issue) => acc + issue.brokenLinks.length, 0),
  };

  const jsonStats = {
    total: jsonIssues.length,
    invalid: jsonIssues.filter((issue) => !issue.valid).length,
  };

  const eslintStats = {
    filesWithIssues: eslintIssues.length,
    totalErrors: eslintIssues.reduce(
      (acc, entry) => acc + entry.messages.filter((message) => message.severity === "error").length,
      0,
    ),
    totalWarnings: eslintIssues.reduce(
      (acc, entry) => acc + entry.messages.filter((message) => message.severity === "warning").length,
      0,
    ),
  };

  const spellingStats = {
    totalIssues: spellingIssues.length,
    filesWithIssues: new Set(spellingIssues.map((issue) => issue.file)).size,
  };

  const report: ContentReport = {
    generatedAt: new Date().toISOString(),
    markdown: {
      issues: mdIssues,
      stats: markdownStats,
    },
    json: {
      issues: jsonIssues,
      stats: jsonStats,
    },
    eslint: {
      issues: eslintIssues,
      stats: eslintStats,
    },
    spelling: {
      issues: spellingIssues,
      stats: spellingStats,
    },
  };

  const jsonPath = path.join(reportsDir, "content-consistency.json");
  const markdownPath = path.join(reportsDir, "content-consistency.md");

  await writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");
  await writeFile(markdownPath, buildMarkdown(report), "utf8");

  console.log(`Informe generado en:\n- ${path.relative(workspaceRoot, jsonPath)}\n- ${path.relative(workspaceRoot, markdownPath)}`);
}

main().catch((error) => {
  console.error("Error al generar el informe de consistencia:", error);
  process.exit(1);
});
