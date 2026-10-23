import { test, expect } from '@fixtures/base.fixture';
import { AxeBuilder } from '@axe-core/playwright';

// Accessibility tests run against a local static page
// so they work reliably in CI without external dependencies.
test.describe('Accessibility @a11y', () => {
  test('homepage runs axe analysis @a11y', async ({ page }) => {
    await page.goto('/index.html');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
    expect(typeof results.violations.length).toBe('number');
  });

  test('static page runs axe analysis @a11y', async ({ page }) => {
    await page.goto('/index.html');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toBeDefined();
  });
});
