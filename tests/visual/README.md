# Visual Regression Baselines

## Convention
- Baselines are stored in `tests/visual/*.spec.ts-snapshots/`
- Naming: `<test-file>-<project>-<os>.png`
- Example: `visual.spec.ts-snapshots/homepage-chromium-linux.png`

## Generating Baselines
Run locally on your target OS (or in CI with matching OS):

```bash
# Update all visual baselines
npm run test:visual:update

# Or for a specific project
npx playwright test --grep @visual --project=chromium --update-snapshots
```

## CI Considerations
- Baselines **must** be generated on the same OS as CI runs (Linux for GitHub Actions)
- If you develop on Windows/macOS, generate baselines in a Linux container or CI
- Use `maxDiffPixels` threshold to tolerate minor rendering differences

## Updating Baselines
1. Make your changes
2. Run `npm run test:visual:update` on the target OS
3. Commit the updated snapshots
4. Push — CI will verify against the new baselines