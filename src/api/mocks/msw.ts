/**
 * MSW (Mock Service Worker) setup for Playwright API tests
 * This runs in the Node.js context and intercepts fetch/XMLHttpRequest
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the MSW server
export const mswServer = setupServer(...handlers);

// Helper to start/stop in tests
export function startMSW() {
  mswServer.listen();
}

export function stopMSW() {
  mswServer.close();
}

export function resetMSW() {
  mswServer.resetHandlers();
}