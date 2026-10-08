import { defineConfig } from '@playwright/test';

// CHROME_PATH lets you point the tests at an existing Chromium (for example in a container without the Playwright download).
const chrome = process.env.CHROME_PATH;
const args = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--ignore-gpu-blocklist',
  '--in-process-gpu',
];

export default defineConfig({
  testDir: 'e2e',
  timeout: 420_000,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 800, height: 500 },
    // The GPU flags are passed in both cases: headless runners have no GPU, so WebGL uses SwiftShader.
    launchOptions: { executablePath: chrome || undefined, args },
  },
  // Run `npm run build` first. This serves the built app, which is what users get.
  webServer: {
    command: 'npx next start -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 420_000,
  },
});
