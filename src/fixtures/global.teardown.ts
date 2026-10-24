import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { stopMockServer } from '../api/mocks/server';

async function globalTeardown() {
  // Stop mock API server
  await stopMockServer();
  console.log('[GlobalTeardown] Mock API server stopped');

  // Clean up mock server URL file
  const mockServerFile = path.resolve('.mock-server-url');
  if (fs.existsSync(mockServerFile)) {
    fs.unlinkSync(mockServerFile);
  }

  // In CI, wipe all auth files so session cookies never leak into artifacts
  if (process.env.CI) {
    const authDir = path.resolve('.auth');
    if (fs.existsSync(authDir)) {
      for (const file of fs.readdirSync(authDir)) {
        fs.unlinkSync(path.join(authDir, file));
      }
    }
  }
}

export default globalTeardown;