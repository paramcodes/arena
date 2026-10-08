import { test, expect } from '@playwright/test';

test('hub loads with the mission panel, and pause works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Game Development Learning World' })).toBeVisible();
  await expect(page.getByText("The Wall That Isn't a Wall")).toBeVisible();

  await page.getByRole('button', { name: 'Pause (Esc)' }).click();
  await expect(page.getByRole('button', { name: 'Resume (Esc)' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume (Esc)' }).click();
  await expect(page.getByRole('button', { name: 'Resume (Esc)' })).toHaveCount(0);
});
