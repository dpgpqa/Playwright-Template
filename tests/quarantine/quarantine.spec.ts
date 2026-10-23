import { test, expect } from '@fixtures/base.fixture';

const skipOutsideQuarantine = process.env.CI_QUARANTINE !== 'true';

/**
 * Quarantine: Flaky tests that need investigation.
 * These tests run in a separate CI job and DO NOT block merge.
 *
 * To quarantine a test:
 * 1. Add @quarantine tag
 * 2. Add comment with reason, date, owner, linked issue
 * 3. Create GitHub issue with test details
 * 4. Review weekly: remove tag if stable for 2 weeks, or fix/remove
 */

test.describe('Quarantine: Flaky Tests @quarantine', () => {
  // Example: This test is quarantined because AutomationExercise
  // occasionally returns 502 under load in CI runners.
  //
  // Reason: Intermittent 502 errors from demo site
  // Date: 2026-10-23
  // Owner: QA Team
  // Issue: #quarantine-001
  test('intermittent checkout flow @quarantine', async ({ page }) => {
    if (skipOutsideQuarantine) test.skip();
    test.info().annotations.push({
      type: 'quarantine-reason',
      description: 'Intermittent 502 errors from demo site under load'
    });
    test.info().annotations.push({
      type: 'linked-issue',
      description: '#quarantine-001'
    });

    // This test occasionally fails due to external site instability
    // It should pass consistently once the root cause is fixed
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);
  });
});
