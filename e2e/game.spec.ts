import { test, expect, type Page } from '@playwright/test';

// The software renderer used in CI runs slowly, and the physics steps once per frame.
// So walking tests hold a key until the Inspector's live position reaches a target,
// instead of waiting a fixed time. This works at any frame rate.

async function openWorld(page: Page) {
  await page.goto('/');
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 90_000 });
  await page.keyboard.press('F3');
  await expect(page.getByRole('complementary', { name: 'Inspector' })).toBeVisible();
  await expect(page.locator('dt:text-is("position") + dd')).not.toHaveText('');
}

const readPosition = async (page: Page): Promise<number[]> =>
  ((await page.locator('dt:text-is("position") + dd').textContent()) ?? '').split(',').map((n) => Number(n.trim()));

// Hold a key until the player's position satisfies `done`, or give up after the limit.
async function holdUntil(page: Page, key: string, done: (p: number[]) => boolean, limitMs = 300_000) {
  await page.keyboard.down(key);
  const start = Date.now();
  try {
    while (Date.now() - start < limitMs) {
      if (done(await readPosition(page))) return;
      await page.waitForTimeout(200);
    }
    throw new Error(`position never reached the target while holding ${key}`);
  } finally {
    await page.keyboard.up(key);
  }
}

// Steer toward (tx, tz) with short key pulses, correcting after each one, until within the tolerance.
// Short pulses avoid overshooting when the frame rate is low.
async function walkTo(page: Page, tx: number, tz: number, tolerance = 1.5, limitMs = 250_000) {
  const start = Date.now();
  while (Date.now() - start < limitMs) {
    const [x, , z] = await readPosition(page);
    const dx = tx - x;
    const dz = tz - z;
    if (Math.hypot(dx, dz) <= tolerance) return;
    // Forward is -Z, so KeyW goes -Z and KeyS goes +Z. KeyD goes +X at the default camera angle.
    const key = Math.abs(dz) >= Math.abs(dx) ? (dz > 0 ? 'KeyS' : 'KeyW') : dx > 0 ? 'KeyD' : 'KeyA';
    await page.keyboard.down(key);
    await page.waitForTimeout(400);
    await page.keyboard.up(key);
    await page.waitForTimeout(700); // let the Inspector refresh
  }
  throw new Error(`could not reach (${tx}, ${tz})`);
}

const number = (text: string | null) => Number((text ?? '').replace(/[^0-9.]/g, ''));

test('hub loads with the 3D view, the mission, and no page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await openWorld(page);
  await expect(page.locator('.mission')).toContainText("The Wall That Isn't a Wall");
  expect(errors).toEqual([]);
});

test('walking straight into the wall with the collider off completes the first step', async ({ page }) => {
  await openWorld(page);
  await expect(page.locator('.mission')).not.toContainText('✓');
  // The spawn is at z = 4 and the wall's back face is at z = -12.3. Walk through it.
  await holdUntil(page, 'KeyW', (p) => p[2] < -13);
  await expect(page.locator('.mission')).toContainText('✓');
});

test('instanced draw calls stay flat as the tree count grows; separate meshes are culled when out of view', async ({ page }) => {
  await openWorld(page);
  // The performance panel is at (-3, 34). Stand within its 2.2 m trigger radius and press E.
  await walkTo(page, -3, 33.5, 0.8);
  await expect(page.locator('.prompt')).toContainText('performance panel', { timeout: 15_000 });
  await page.keyboard.press('KeyE');
  const dialog = page.getByRole('dialog', { name: 'Performance panel' });
  await expect(dialog).toBeVisible({ timeout: 10_000 });
  const drawCalls = async () => {
    await page.waitForTimeout(3000); // a few renderer samples at the new setting
    return number(await dialog.locator('dt:has-text("Draw calls") + dd').textContent());
  };

  await dialog.getByRole('button', { name: '100 trees' }).click();
  const at100 = await drawCalls();
  await dialog.getByRole('button', { name: '50,000 trees' }).click();
  const at50k = await drawCalls();
  await dialog.getByLabel('Instancing on').uncheck();
  await dialog.getByRole('button', { name: '1,000 trees' }).click();
  const separate1k = await drawCalls();

  console.log(`draw calls: instanced 100=${at100}, instanced 50,000=${at50k}, separate 1,000=${separate1k}`);
  // Instancing: one call for all the trees, however many there are.
  expect(at50k).toBe(at100);
  // Separate meshes: trees outside the camera's view are culled, so 1,000 separate trees make far fewer calls.
  // From this viewpoint the forest is behind the camera, so most are culled.
  expect(separate1k).toBeLessThan(1000);
}); 

test('Escape pauses the game and Escape resumes it', async ({ page }) => {
  await openWorld(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Resume (Esc)' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Resume (Esc)' })).toHaveCount(0);
});
