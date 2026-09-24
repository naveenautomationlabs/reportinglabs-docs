# reportinglabs.dev

The public documentation site for [reportingLabs](https://github.com/naveenautomationlabs/reporting-labs). Built with [Docusaurus](https://docusaurus.io/).

Live at **https://reportinglabs.dev**.

## Local development

```bash
npm ci
npm start                # dev server on http://localhost:3000
```

## Production build

```bash
npm run build            # writes to ./build
npm run serve            # preview the built site
```

## How it deploys

Two options — pick one, use one.

### Option A — Cloudflare Pages (recommended)

Best global CDN, free custom domain SSL, deploys on git push automatically.

1. Log into Cloudflare → Workers & Pages → Create → **Pages** → **Connect to Git**.
2. Select this repository, main branch.
3. Build settings:
   - Framework preset: **Docusaurus**
   - Build command: `npm run build`
   - Build output directory: `build`
4. Save. Cloudflare builds and deploys.
5. Under **Custom domains**, add `reportinglabs.dev`. Cloudflare auto-provisions SSL.

Delete or ignore the `.github/workflows/deploy.yml` file (it is a GitHub Pages fallback).

### Option B — GitHub Pages

Ship as-is. `.github/workflows/deploy.yml` builds on every push to `main` and deploys to Pages.

1. In this repo's Settings → Pages → Build source: **GitHub Actions**.
2. In Settings → Pages → Custom domain: `reportinglabs.dev`.
3. The `static/CNAME` file is already in place.
4. Push to `main`, workflow runs, site is live.

## Content structure

```
docs/
├── intro.md                     — what is reportingLabs
├── get-started/                 — install + tag your tests (JS, Java JUnit 5, Java TestNG, Python soon)
├── features/                    — meta, failure clusters, bug report, history, sharding, plain-language errors
├── reference/                   — all options table, API
├── ci/                          — GitHub Actions, Jenkins, GitLab recipes
└── compare/                     — vs Allure and Playwright HTML
```

Edit any page, push, deployed within 1-2 minutes.
