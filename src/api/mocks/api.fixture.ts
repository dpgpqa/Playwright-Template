import { test as base, APIRequestContext } from '@playwright/test';
import { startMockServer, stopMockServer } from './server.js';

/**
 * API test fixtures with shared Mock HTTP Server per worker
 * One server per worker, shared between both fixtures
 */

type APIFixtures = {
  automationExerciseApiRequest: APIRequestContext;
  dummyJsonApiRequest: APIRequestContext;
};

// Module-level server state - shared across fixtures in same worker
let workerServerUrl: string | null = null;

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

export const test = base.extend<{}, {
  automationExerciseApiRequest: APIRequestContext;
  dummyJsonApiRequest: APIRequestContext;
}>({
  // Worker-scoped: runs once per worker process
  automationExerciseApiRequest: [
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
