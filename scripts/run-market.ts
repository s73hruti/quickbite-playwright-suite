import { spawnSync } from 'node:child_process';

/**
 * Runs the suite for a single market only.
 *
 * playwright.config.ts assigns each spec file to exactly one market's project
 * via `testMatch` (see MARKET_E2E_FILES / SMOKE_FILES there) — no per-test
 * tags involved. `--project=chromium-<market>` alone is enough; this script
 * just normalizes the market argument (case, validity) so a typo fails fast
 * with a clear message instead of Playwright silently reporting "no tests
 * found" or, worse, matching nothing and exiting 0.
 *
 * Usage:
 *   npm run test:market -- CA
 *   npm run test:market -- uk --headed   (extra flags are forwarded as-is)
 */

const SUPPORTED_MARKETS = ['US', 'UK', 'DE', 'PT', 'CA'] as const;
type Market = (typeof SUPPORTED_MARKETS)[number];

function isMarket(value: string): value is Market {
  return (SUPPORTED_MARKETS as readonly string[]).includes(value);
}

const [rawMarket, ...extraArgs] = process.argv.slice(2);
const market = rawMarket?.toUpperCase();

if (!market || !isMarket(market)) {
  console.error(
    `Usage: npm run test:market -- <MARKET> [extra playwright args]\n` +
      `Supported markets: ${SUPPORTED_MARKETS.join(', ')}`
  );
  process.exit(1);
}

const project = `chromium-${market.toLowerCase()}`;

const result = spawnSync('npx', ['playwright', 'test', '--project', project, ...extraArgs], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);