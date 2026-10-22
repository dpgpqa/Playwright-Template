import { test, expect } from '@fixtures/base.fixture';
import * as testData from '../../test-data/test-cases.json';

type TestCase = (typeof testData.testCases)[number];
type User = (typeof testData.users)[number];

/**
 * Data-driven test suite using external JSON test data.
 * Each test case includes priority tags (@critical, @high, @medium, @low).
 */
test.describe('Data-Driven Tests @data-driven', () => {

  for (const tc of testData.testCases) {
    test(`[${tc.priority.toUpperCase()}] ${tc.name} @${tc.priority} ${tc.tags.join(' ')}`, async ({ page }) => {
      // Log test metadata for traceability
      test.info().annotations.push({
        type: 'test-case-id',
        description: tc.id
      });
      test.info().annotations.push({
        type: 'priority',
        description: tc.priority
      });
      test.info().annotations.push({
        type: 'tags',
        description: tc.tags.join(', ')
      });

      // Placeholder: implement based on tc.type (ui/api)
      // This demonstrates data-driven structure; actual assertions
      // would be implemented per test case type.
      expect(tc.expectedResult).toBeDefined();
      expect(tc.priority).toMatch(/critical|high|medium|low/);
    });
  }

  /**
   * User data-driven tests - validates each user from JSON
   */
  test.describe('Data-Driven: Users @data-driven', () => {
    for (const user of testData.users) {
      test(`[${user.priority.toUpperCase()}] User: ${user.username} @${user.priority} @smoke`, async ({ page }) => {
        test.info().annotations.push({
          type: 'user',
          description: user.username
        });
        test.info().annotations.push({
          type: 'shouldLogin',
          description: String(user.shouldLogin)
        });

        // Placeholder validation
        expect(user.username).toBeDefined();
        expect(user.password).toBeDefined();
        expect(user.shouldLogin).toBeDefined();
      });
    }
  });
});
