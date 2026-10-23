/** @type {import('nyc').Config} */
module.exports = {
  all: true,
  include: [
    'src/**/*.ts',
    'tests/**/*.ts'
  ],
  exclude: [
    'node_modules/**',
    'tests/fixtures/static/**',
    'playwright-report/**',
    'blob-report/**',
    'reports/**',
    'merged-reports/**',
    '*.config.*',
    '**/*.d.ts'
  ],
  reporter: ['html', 'text', 'cobertura'],
  thresholds: {
    statements: 40,
    branches: 25,
    functions: 40,
    lines: 40
  },
  sourceMap: false,
  instrument: true,
  checkCoverage: true,
  lines: 40,
  statements: 40,
  branches: 25,
  functions: 40
};
