# Vansh Marwaha portfolio

Static Next.js portfolio for independent security researcher Vansh Marwaha. It builds a sanitized, searchable writeup archive from [`Vansh018/Writeups`](https://github.com/Vansh018/Writeups) and exports to GitHub Pages.

## Local development

```bash
npm install
npm run sync:writeups
npm run dev
```

Use `WRITEUPS_LOCAL_PATH` in `.env.local` to read a local checkout instead of GitHub. The path must point to the Writeups repository root.

Add a `GITHUB_TOKEN` to `.env.local` for reliable syncing. Writeups without a date in their content are dated from the file's last commit, which needs one GitHub API call per file. Unauthenticated requests are capped at 60 per hour per IP, so repeated local syncs can exhaust the quota; a token raises it to 5,000. If the quota is exhausted the sync reuses the existing archive and warns rather than failing, and resolved dates are cached in `src/generated/writeups/commit-dates.json` so they are not re-fetched.

A fine-grained token with read-only **Contents** access on the Writeups repository is enough. It is only read by the build script and is never exposed to the browser.

## Checks and build

```bash
npm run check
npm run build
```

The production build synchronizes writeups and emits the static site to `out/`.

## Publishing writeups

Add a Markdown file under `writeups/<platform>/<challenge>/` in the Writeups repository. The portfolio deployment runs daily and can also be started manually.

For immediate updates, add a workflow to the Writeups repository that sends a `repository_dispatch` event named `writeups-updated` to the portfolio repository whenever `writeups/**` changes. Store a fine-grained token with permission to trigger the portfolio workflow as `PORTFOLIO_DISPATCH_TOKEN`; never expose it to the website.

```yaml
name: Refresh portfolio
on:
  push:
    branches: [main]
    paths: ["writeups/**"]
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PORTFOLIO_DISPATCH_TOKEN }}
          repository: OWNER/PORTFOLIO_REPOSITORY
          event-type: writeups-updated
```

Set the portfolio repository’s Pages source to **GitHub Actions**. Optionally add a repository variable named `SITE_URL` with the final public URL for canonical metadata and sitemap entries.
