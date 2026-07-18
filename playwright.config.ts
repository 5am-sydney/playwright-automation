import { defineConfig } from '@playwright/test'
import os from 'os'

export default defineConfig({
  testDir: './tests',
  retries: 0,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  globalTeardown: './helpers/allureExecutor.ts',
  reporter: [
    ['list'],
    ['html'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableMochaHooks: true,
        environmentInfo: {
          Environment: process.env.ENV,
          'Base URL': process.env.BASE_URL,
          Browser: 'Chromium',
          OS: `${os.type()} ${os.release()}`,
          'Node Version': process.version,
          CI: process.env.CI ? 'true' : 'false',
        },
        categories: [
          {
            name: 'Ignored tests',
            matchedStatuses: ['skipped'],
          },
          {
            name: 'Infrastructure problems',
            matchedStatuses: ['broken', 'failed'],
            messageRegex: '.*(ECONNREFUSED|ENOTFOUND|net::ERR_|Timeout).*',
          },
          {
            name: 'Outdated tests',
            matchedStatuses: ['broken'],
            traceRegex: '.*(TypeError|Cannot find module).*',
          },
          {
            name: 'Product defects',
            matchedStatuses: ['failed'],
          },
        ],
      },
    ],
  ],
  use: {
    browserName: 'chromium',
    headless: !!process.env.CI,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
})
