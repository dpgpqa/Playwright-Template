import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown() {
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