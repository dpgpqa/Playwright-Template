import { test as base, APIRequestContext } from '@playwright/test';
import { startMockServer } from './server.js';

/**
 * API test fixtures with shared Mock HTTP Server per worker
 * One server per worker, shared between both fixtures
 */

// Module-level server state - shared across fixtures in same worker
const workerServerUrl: string | null = null;

function getWorkerPort(): number {
  const workerIndex = process.env.TEST_WORKER_INDEX ? parseInt(process.env.TEST_WORKER_INDEX, 10) : 0;
  return 3001 + (workerIndex || 0);
}

async function getOrStartWorkerServer(): Promise<string> {
  if (workerServerUrl) return workerServerUrl;
  
  const port = getWorkerPort();
  const url = await startMockServer(port);
  console.log(`[MockServer] Worker ${process.env.TEST_WORKER_INDEX || '0'} started on ${url}`);
  return url;
}

export const test = base.extend<object, {
  automationExerciseApiRequest: APIRequestContext;
  dummyJsonApiRequest: APIRequestContext;
}>({
  // Worker-scoped: runs once per worker process
  automationExerciseApiRequest: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const mockServerUrl = await getOrStartWorkerServer();

      const { request } = await import('@playwright/test');
      const requestContext = await request.newContext({
        baseURL: `${mockServerUrl}/api`,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      });

      await use(requestContext);
      await requestContext.dispose();
    },
    { scope: 'worker' },
  ],

  dummyJsonApiRequest: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const mockServerUrl = await getOrStartWorkerServer();

      const { request } = await import('@playwright/test');
      const requestContext = await request.newContext({
        baseURL: mockServerUrl,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      });

      await use(requestContext);
      await requestContext.dispose();
    },
    { scope: 'worker' },
  ],
});

test.afterAll(async () => {
  const { stopMockServer } = await import('./server.js');
  await stopMockServer();
  console.log('[MockServer] Stopped for worker');
});

export { expect } from '@playwright/test';
