import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  retries: 0,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results', disableWebdriverStepsReporting: true, disableMochaHooks: true }],
  ],
  use: {
    browserName: 'chromium',
    headless: !!process.env.CI,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
})
