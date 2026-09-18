import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/**
 * Central Playwright configuration for the AI-Augmented Playwright Test Suite.
 *
 * In the real Capgemini/CyPost-style setup this file would branch per market
 * (US, UK, Germany, Portugal, Canada) via env vars (MARKET, BASE_URL, LOCALE).
 * Here it targets a fictional demo POS/kiosk app so the suite runs standalone.
 *
 * Running for a single market:
 *   npx playwright test --project=chromium-ca          # all CA tests
 *   npx playwright test --grep "@TC-E2E-07"             # test 07, runs once, correct market automatically
 *   npm run test:market -- CA                           # wrapper, same as first command
 * See MARKET_E2E_FILES / SMOKE_FILES / projects below for how each spec file is
 * scoped to its market's project.
 */
const PORT = Number(process.env.STATIC_SERVER_PORT ?? 4173);

type Market = 'US' | 'UK' | 'DE' | 'PT' | 'CA';

/**
 * Every e2e spec file logs in as one specific market via `loginAs(storeId, pin, market)`
 * (see src/pages/login.page.ts). This table is the single source of truth for which
 * e2e file belongs to which market, so `--project=chromium-<market>` runs only the e2e
 * specs that actually exercise that market instead of every file under every locale.
 * Smoke tests are handled separately below — they run under every market regardless of
 * which single market their own login call happens to use.
 *
 * Paths are relative to `testDir` below.
 *
 * IMPORTANT: one file is misleadingly named — the filename says PT but the test
 * actually calls loginAs(..., 'DE'). It's grouped by what the test actually does,
 * not by its filename:
 *   - e2e/07-PT_CashCheckout.spec.ts  -> logs in as DE, not PT
 * Worth renaming it to stop it lying to the next person; not done here since it
 * wasn't asked for.
 */
const MARKET_E2E_FILES: Record<Market, string[]> = {
  US: [
    'e2e/08-US_MobileCheckout.spec.ts',
    'e2e/09-US_UniqueOrderNumbers.spec.ts',
    'e2e/12-US_ValidLoginNoError.spec.ts',
    'e2e/14-US_MalformedPinRejected.spec.ts',
  ],
  UK: ['e2e/10-UK_AlldayHidesBreakfastBanner.spec.ts'],
  DE: [
    'e2e/03-DE_ComboBadgeHidden.spec.ts',
    'e2e/04-DE_CheckoutEnablesAfterItemAdded.spec.ts',
    'e2e/07-PT_CashCheckout.spec.ts', // actually DE — see note above
  ],
  PT: ['e2e/05-PT_FullCheckout.spec.ts', 'e2e/13-PT_ComboBadgeVisible.spec.ts'],
  CA: [
    'e2e/02-CA_CashCheckout.spec.ts',
    'e2e/06-CA_FullCheckout.spec.ts',
    'e2e/11-CA_InvalidLoginRejected.spec.ts',
  ],
};

/**
 * Smoke tests are sanity checks meant to run everywhere, regardless of which one
 * market their own login call happens to use — so every project runs all 7,
 * unlike the e2e files above which are scoped one-market-per-file.
 */
const SMOKE_FILES = [
  'smoke/smoke-01.ts',
  'smoke/smoke-02.ts',
  'smoke/smoke-03.ts',
  'smoke/smoke-04.ts',
  'smoke/smoke-05.ts',
  'smoke/smoke-06.ts',
  'smoke/smoke-07.ts',
];

/** Data-driven breadth check that loops through all 5 markets in one test; runs under every project. */
const ALL_MARKETS_SPEC = 'e2e/01-allMarketLogin.ts';

const MARKET_LOCALES: Record<Market, string> = {
  US: 'en-US',
  UK: 'en-GB',
  DE: 'de-DE',
  PT: 'pt-PT',
  CA: 'en-CA',
};

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/playwright-report.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  webServer: {
    command: 'tsx scripts/static-server.ts',
    url: `http://localhost:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  use: {
    baseURL: process.env.BASE_URL ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: process.env.LOCALE ?? 'en-US',
    //launchOptions: { slowMo: 1000 }, //use when debugging to slow down the execution of the tests
    // Optional escape hatch for environments with their own Chromium build
    // (locked-down CI images, corporate images, etc.) instead of the one
    // `npx playwright install` downloads.
    ...(process.env.PW_CHROMIUM_EXECUTABLE_PATH
      ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_EXECUTABLE_PATH } }
      : {}),
  },
  // One project per market. Each project's testMatch runs: the all-markets breadth
  // check, every smoke test (smoke tests always run on every market), and only that
  // market's own e2e files, via MARKET_E2E_FILES above — so
  // `npx playwright test --project=chromium-ca` runs CA's e2e tests plus all smoke
  // tests, not the other markets' e2e files. Omitting --project still runs every
  // project, each correctly scoped.
  projects: (Object.keys(MARKET_LOCALES) as Market[]).map((market) => ({
    name: `chromium-${market.toLowerCase()}`,
    use: { ...devices['Desktop Chrome'], locale: MARKET_LOCALES[market] },
    testMatch: [ALL_MARKETS_SPEC, ...SMOKE_FILES, ...MARKET_E2E_FILES[market]],
  })),
});