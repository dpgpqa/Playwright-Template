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
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80
  },
  sourceMap: false,
  instrument: true,
  checkCoverage: true,
  lines: 80,
  statements: 80,
  branches: 75,
  functions: 80
};
