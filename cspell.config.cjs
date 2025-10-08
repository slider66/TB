/** @type {import('cspell').CSpellSettings} */
module.exports = {
  version: '0.2',
  language: 'es',
  // Activa diccionarios por NOMBRE (pnpm-friendly)
  dictionaries: ['es-es', 'softwareTerms', 'companies'],

  // Define cada diccionario por paquete (sin rutas locales)
  dictionaryDefinitions: [
    { name: 'es-es',        package: '@cspell/dict-es-es' },
    { name: 'softwareTerms', package: '@cspell/dict-software-terms' },
    { name: 'companies',     package: '@cspell/dict-companies' },
  ],

  // Palabras propias del proyecto (añade aquí tus “falsos positivos”)
  words: [
    'Supabase', 'Tailwind', 'TypeScript', 'Zod', 'Vite',
    'Traductor', 'Burocrático', 'Burocratico', 'Hostinger',
  ],

  ignorePaths: [
    'node_modules', 'dist', 'build', '.git', '.husky', 'pnpm-lock.yaml'
  ],
};
