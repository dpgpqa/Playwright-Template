import { FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

async function globalSetup() {
  const requiredVars = ['BASE_URL'];
  for (const v of requiredVars) {
    if (!process.env[v]) {
      throw new Error(`Missing required env var: ${v}. Copy .env.example to .env.local and fill it in.`);
    }
  }

  // Validate BASE_URL format
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error('BASE_URL is not set');
  try {
    new URL(baseUrl);
  } catch {
    throw new Error(`BASE_URL must be a valid URL, got: ${baseUrl}`);
  }

  // Clean stale auth files from previous runs (unless PW_KEEP_AUTH=1)
  if (!process.env.PW_KEEP_AUTH) {
    const authDir = path.resolve('.auth');
    if (fs.existsSync(authDir)) {
      for (const file of fs.readdirSync(authDir)) {
        if (file.startsWith('user-') && file.endsWith('.json')) {
          fs.unlinkSync(path.join(authDir, file));
        }
      }
    }
  }
}

export default globalSetup;