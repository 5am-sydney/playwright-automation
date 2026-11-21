# Playwright agent workflow (planner → generator → healer)

Three Claude Code subagents live in `.claude/agents/`. They drive a real browser through the `playwright-test` MCP server and turn a feature into reviewed, passing tests.

| Agent | Job | Output |
|---|---|---|
| `playwright-test-planner` | Explores the live app and writes a test plan | `specs/<feature>-plan.md` |
| `playwright-test-generator` | Turns one plan scenario into a spec file | `tests/<feature>/<name>.spec.ts` |
| `playwright-test-healer` | Debugs and fixes a failing test | an edit to that spec |

## Setup (once per clone)

1. `npm install`
2. `cp .env.uat .env` — the MCP server does not load `env-cmd`, so `BASE_URL` must come from a local `.env` (git-ignored). Without it the seed test fails with `page.goto: url: expected string, got undefined`.
3. `.mcp.json` must contain a server named exactly `playwright-test` (`npx playwright run-test-mcp-server`). The agents' `tools:` lines reference `mcp__playwright-test__*`; renaming the server breaks all three. Restart the Claude session after changing `.mcp.json` or the agent files.
4. `tests/seed.spec.ts` logs in as `standard_user` and lands on the inventory page. Every agent run starts from it.

Agent files are identified by the `name:` in their frontmatter. Keep those names unchanged so `npx playwright init-agents` can refresh them.

## Running order

1. **Plan** one feature at a time.
2. **Generate** the scenarios **one at a time** (the agents share one browser, so do not run two browser agents in parallel).
3. **Run the tests yourself** — the generator and healer agents have no shell and may not run the spec files.
4. **Repeat-run for flakiness**: `CI=1 npx playwright test tests/<feature> --repeat-each=10`. A single green run hid two flaky tests in the past.
5. **Heal** only what fails, then repeat step 4.

## Prompt templates

Fill in the `<...>` parts. Keep the exclusion lists — they stop the agents planning things this framework does not cover.

### Planner

```
Create ONE test plan for <area> of https://www.saucedemo.com and save it to
specs/<feature>-plan.md with planner_save_plan. BASE_URL comes from .env, so
the seed tests/seed.spec.ts works. Work efficiently: call planner_setup_page
first, explore with browser_snapshot and simple clicks, avoid
browser_run_code_unsafe and long scripts, do not wait long on any step (move
on and note it), and save within about 30 tool calls. Verify selectors and
exact texts LIVE.

Cover (about 10-15 scenarios): <list>.

ALREADY COVERED, do NOT plan: <list existing tests>.

OUT OF SCOPE, do not plan: accessibility, security testing, real devices,
external sites, backend/API, exploratory/usability, performance/load.
Keep scenarios deterministic and independent. Give each scenario a target
file under tests/<feature>/. In your report list scenario titles, file
names and any behaviour that differed from what you expected.
```

### Generator

```
Generate the <N> tests described in specs/<feature>-plan.md (read it first).
Do them ONE AT A TIME; finish generator_write_test for each before starting
the next. Seed file: tests/seed.spec.ts. Use RELATIVE paths such as
tests/<feature>/<name>.spec.ts (absolute paths are rejected).

Follow tests/cart/add-to-cart.spec.ts: LoginPage from '../../pages/loginPage',
data-test locators, web-first assertions, no waitForTimeout, a step comment
before each step. Each test is independent: it logs in, adds its own items
and walks the flow itself.

RELIABILITY: after every navigation click, first assert the new URL with
expect(page).toHaveURL(...) AND wait for an element that exists only on the
new page BEFORE asserting on shared locators (inventory-item-name,
inventory-item-price) that also exist on the previous page.

Verify live anything the plan marks as unverified. Where the app behaves
oddly, assert the real behaviour and add a comment saying it documents
current app behaviour. Do not assert on console errors. You have no shell:
do not run the tests. Report each file and anything not verified live.
```

### Healer

```
Fix the failing test <file>. BASE_URL comes from .env. Run it, inspect the
live page, edit ONLY that file, re-run until it passes. First decide whether
the failure is (a) a wrong locator/timing in the test, (b) a wrong
assumption in the plan about app behaviour, or (c) a real app defect. For
(b), change only the assertions that contradict the real behaviour and add
a comment. For (c), do not hide it: use test.fixme and report it. Do not
weaken any other assertion. Report the root cause and every change.
```

## Rules of thumb learned so far

- Scenarios that start un-logged-in (login tests) must not use the seed login; a fresh Playwright context per test is enough.
- Prefer `getByRole` or `#react-burger-menu-btn` over `[data-test="open-menu"]`/`[data-test="close-menu"]`; the latter matches an `<img>` that can hang or violate strict mode.
- Two products cost $15.99; compare price-sorted lists as pairs, not a fixed order.
- If a planner or generator stalls for several minutes, stop it and restart with a smaller scope; the saved plan files are not lost.
