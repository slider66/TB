import { corsHeaders } from './cors.ts';

const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY');
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB

type ScanSummary = {
  analysisId: string | null;
  status: string;
  verdict: 'pending' | 'clean' | 'malicious';
  stats?: Record<string, unknown>;
  sha256?: string | null;
  md5?: string | null;
  submittedAt?: number | null;
  finishedAt?: number | null;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function submitFileToVirusTotal(file: File): Promise<ScanSummary> {
  if (!VIRUSTOTAL_API_KEY) {
    throw new Error('VirusTotal API key not configured. Set VIRUSTOTAL_API_KEY in Supabase secrets.');
  }

  const requestBody = new FormData();
  requestBody.append('file', file, file.name || 'document');

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': VIRUSTOTAL_API_KEY,
    },
    body: requestBody,
  });

  if (!response.ok) {
    const payloadText = await response.text();
    let details: unknown = payloadText;
    try {
      details = JSON.parse(payloadText);
    } catch {
      // ignore JSON parse errors, keep raw text
    }

    const statusCode = response.status >= 500 ? 502 : 400;
    throw Object.assign(
      new Error('VirusTotal did not accept the file.'),
      {
        name: 'VirusTotalSubmissionError',
        status: statusCode,
        details,
      },
    );
  }

  const json = await response.json();
  const analysisId = json?.data?.id ?? null;
  const stats = json?.data?.attributes?.stats ?? undefined;
  const status = json?.data?.attributes?.status ?? 'queued';
  const sha256 =
    json?.meta?.file_info?.sha256 ?? json?.data?.attributes?.sha256 ?? null;
  const md5 = json?.meta?.file_info?.md5 ?? null;
  const submittedAt = json?.data?.attributes?.date ?? null;

  return {
    analysisId,
    status,
    verdict: 'pending',
    stats,
    sha256,
    md5,
    submittedAt,
    finishedAt: null,
  };
}

async function fetchAnalysisStatus(analysisId: string): Promise<ScanSummary> {
  if (!VIRUSTOTAL_API_KEY) {
    throw new Error('VirusTotal API key not configured. Set VIRUSTOTAL_API_KEY in Supabase secrets.');
  }

  const response = await fetch(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      method: 'GET',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    },
  );

  if (!response.ok) {
    const payloadText = await response.text();
    let details: unknown = payloadText;
    try {
      details = JSON.parse(payloadText);
    } catch {
      // ignore JSON parse errors
    }

    const statusCode = response.status >= 500 ? 502 : 400;
    throw Object.assign(
      new Error(`VirusTotal analysis lookup failed for ${analysisId}.`),
      {
        name: 'VirusTotalLookupError',
        status: statusCode,
        details,
      },
    );
  }

  const json = await response.json();
  const status = json?.data?.attributes?.status ?? 'unknown';
  const stats = json?.data?.attributes?.stats ?? undefined;
  const sha256 =
    json?.meta?.file_info?.sha256 ?? json?.data?.attributes?.sha256 ?? null;
  const md5 = json?.meta?.file_info?.md5 ?? null;
  const submittedAt = json?.data?.attributes?.date ?? null;
  const finishedAt = json?.data?.attributes?.completion_date ?? null;

  let verdict: ScanSummary['verdict'] = 'pending';
  if (status === 'completed') {
    const malicious = (stats?.malicious as number | undefined) ?? 0;
    const suspicious = (stats?.suspicious as number | undefined) ?? 0;
    verdict = malicious > 0 || suspicious > 0 ? 'malicious' : 'clean';
  }

  return {
    analysisId,
    status,
    verdict,
    stats,
    sha256,
    md5,
    submittedAt,
    finishedAt,
  };
}

async function handlePost(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return jsonResponse(
      { error: 'Expected multipart/form-data request with a file field.' },
      400,
    );
  }

  const formData = await req.formData();
  const fileField = formData.get('file');

  if (!(fileField instanceof File)) {
    return jsonResponse({ error: 'Missing file field in upload.' }, 400);
  }

  if (fileField.size === 0) {
    return jsonResponse({ error: 'Uploaded file is empty.' }, 400);
  }

  if (fileField.size > MAX_FILE_BYTES) {
    return jsonResponse(
      {
        error: 'File exceeds the maximum allowed size.',
        maxBytes: MAX_FILE_BYTES,
      },
      413,
    );
  }

  try {
    const summary = await submitFileToVirusTotal(fileField);
    return jsonResponse(summary, 202);
  } catch (error) {
    console.error('Failed to submit file to VirusTotal:', error);
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: number }).status) || 500
        : 500;
    const details =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error);
    return jsonResponse(
      {
        error: 'Unable to submit file for malware scanning.',
        details,
      },
      status,
    );
  }
}

async function handleGet(req: Request) {
  const url = new URL(req.url);
  const analysisId = url.searchParams.get('analysisId');

  if (!analysisId) {
    return jsonResponse({ error: 'analysisId query parameter is required.' }, 400);
  }

  try {
    const summary = await fetchAnalysisStatus(analysisId);
    return jsonResponse(summary);
  } catch (error) {
    console.error('Failed to fetch VirusTotal analysis:', error);
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: number }).status) || 500
        : 500;
    const details =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error);

    return jsonResponse(
      {
        error: 'Unable to retrieve analysis status from VirusTotal.',
        details,
      },
      status,
    );
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method === 'POST') {
    return handlePost(req);
  }

  if (req.method === 'GET') {
    return handleGet(req);
  }

  return jsonResponse({ error: 'Method not allowed.' }, 405);
});
