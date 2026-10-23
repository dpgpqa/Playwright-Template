# Quarantine Tagging Strategy
#
# When a test is flaky (passes sometimes, fails sometimes):
# 1. Add @quarantine tag to the test
# 2. Add a comment with: reason, date, owner, linked issue
# 3. Create a GitHub issue with the test details
# 4. Quarantined tests run in a separate job and don't block merge
#
# Example:
#
# test.skip(process.env.CI ? undefined : 'Skipped in CI')('flaky test @quarantine', async ({ page }) => {
#   // ... test body
# });
#
# Quarantine test suite runs separately:
# npm run test:quarantine   # Runs only @quarantine tests
#
# Review quarantine weekly:
# - If test has been stable for 2 weeks: remove @quarantine tag
# - If test cannot be fixed: consider removing or replacing it
