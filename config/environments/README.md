# Environment Setup Scripts

## Local Development
```bash
# Use development environment (default - automationexercise.com)
npm run env:dev
npm run test:smoke
```

## Staging
```bash
# Use staging environment
npm run env:staging
npm run test:smoke
```

## Production
```bash
# Use production environment
npm run env:prod
npm run test:smoke
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Target application URL for UI tests | `https://automationexercise.com` |
| `DUMMYJSON_BASE_URL` | DummyJSON API base URL | `https://dummyjson.com` |
| `AUTOMATION_EXERCISE_API_BASE` | AutomationExercise API base URL | `https://automationexercise.com/api` |
| `TEST_USER_EMAIL` | Test user email for UI tests | - |
| `TEST_USER_PASSWORD` | Test user password for UI tests | - |
| `DUMMYJSON_USERNAME` | DummyJSON API username | `emilys` |
| `DUMMYJSON_PASSWORD` | DummyJSON API password | `emilyspass` |
| `PLAYWRIGHT_BASE_URL` | Playwright `baseUrl` config | Same as `BASE_URL` |
| `CI` | Set to `true` in CI to skip external-site tests | `false` |
| `LOG_LEVEL` | Log verbosity | `debug` |

## CI Environment Variables (GitHub Secrets)

Add these in GitHub Settings → Secrets and variables → Actions:

| Secret | Description |
|--------|-------------|
| `TEST_USER_EMAIL` | AutomationExercise test account email |
| `TEST_USER_PASSWORD` | AutomationExercise test account password |
| `DUMMYJSON_USERNAME` | DummyJSON test username |
| `DUMMYJSON_PASSWORD` | DummyJSON test password |
| `SLACK_WEBHOOK_URL` | Slack webhook for CI failure notifications |
| `DISCORD_WEBHOOK_URL` | Discord webhook for CI failure notifications |

## .env.local

The `.env.local` file is gitignored. It is created by copying one of the environment files:
- `config/environments/.env.development`
- `config/environments/.env.staging`
- `config/environments/.env.production`

Never commit `.env.local` to the repository.
