async function checkEnvironment(baseURL: string, maxAttempts = 30, intervalMs = 2000): Promise<void> {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(baseURL, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        console.log(`✅ Environment ready at ${baseURL} (attempt ${i}/${maxAttempts})`);
        return;
      }
    } catch {
      // ignore
    }
    console.log(`⏳ Waiting for ${baseURL}... (${i}/${maxAttempts})`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Environment at ${baseURL} not ready after ${maxAttempts} attempts`);
}

const url = process.env.BASE_URL || 'https://automationexercise.com';
checkEnvironment(url).catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});