import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'

function git(command: string): string | undefined {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return undefined
  }
}

export default async function globalTeardown() {
  const resultsDir = path.join(__dirname, '..', 'allure-results')
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true })

  const isGitHubActions = !!process.env.GITHUB_ACTIONS
  const branch = process.env.GITHUB_REF_NAME ?? git('git rev-parse --abbrev-ref HEAD') ?? 'unknown'
  const commit = process.env.GITHUB_SHA?.slice(0, 7) ?? git('git rev-parse --short HEAD') ?? 'unknown'

  const buildUrl =
    isGitHubActions && process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined

  const executor = {
    name: isGitHubActions ? 'GitHub Actions' : 'Local',
    type: isGitHubActions ? 'github' : 'local',
    buildOrder: Number(process.env.GITHUB_RUN_NUMBER) || Date.now(),
    buildName: `${branch}@${commit}`,
    buildUrl,
    reportUrl: undefined,
    reportName: 'Allure Report',
  }

  writeFileSync(path.join(resultsDir, 'executor.json'), JSON.stringify(executor, null, 2))
}
