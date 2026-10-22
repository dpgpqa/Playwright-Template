import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: isCI
    ? [
        ['blob', { outputDir: 'blob-report' }],
        ['./src/reporters/allure-reporter.js', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
        ['github'],
        ['json', { outputFile: 'reports/results.json' }],
      ]
    : [
        ['html', { outputFolder: 'reports/html', open: 'never' }],
        ['list'],
        ['json', { outputFile: 'reports/results.json' }],
      ],

  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.PW_DISABLE_VIDEO ? 'off' : 'retain-on-failure',
    testIdAttribute: 'data-qa',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    ignoreHTTPSErrors: false,
    extraHTTPHeaders: {
      'X-Test-Run': process.env.GITHUB_RUN_ID || 'local',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});