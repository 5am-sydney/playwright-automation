const { cpSync, existsSync } = require('fs')
const path = require('path')

const previousHistory = path.join(__dirname, '..', 'allure-report', 'history')
const nextHistory = path.join(__dirname, '..', 'allure-results', 'history')

if (existsSync(previousHistory)) {
  cpSync(previousHistory, nextHistory, { recursive: true })
}
