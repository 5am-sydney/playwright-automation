# Playwright automation (SauceDemo)

UI functional regression suite in TypeScript + Playwright (Chromium), reported via Allure.

## Commands
- Run all (UAT): `npm run tests:headless` (`tests:headed` to watch)
- Run one spec: `env-cmd -f .env.uat npx playwright test tests/<path>`
- Flakiness check: `CI=1 npx playwright test tests/<feature> --repeat-each=10`
- Report: `npm run allure:generate && npm run allure:open`
- `BASE_URL` comes from `.env.uat` / `.env.prod` via `env-cmd`. Direct `npx playwright` runs and the MCP server need a local `.env` (git-ignored).

## Layout
- `pages/`: page objects. Tests use these, never raw locators.
- `tests/`: specs, grouped by feature (`tests/cart/`). `tests/seed.spec.ts` is the agents' starting state.
- `specs/`: test plans written by the planner agent.
- `docs/agent-workflow.md`: planner → generator → healer workflow. Read it before using the agents.

## Conventions
- Locators use `data-test` attributes and live as private fields in the page object.
- Branch names must be `feature/*`, `fix/*` or `refactor/*`. The Husky pre-commit hook blocks others.

## Out of scope (don't plan, test or count as gaps)
External/third-party sites, accessibility, real devices, security, backend, exploratory/usability.

## Agents
- Keep the MCP server named `playwright-test` in `.mcp.json`. Renaming it breaks all three agents.
- Generate scenarios one at a time (shared browser). Run the tests yourself, because the agents may not.
