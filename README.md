# Seizure Termination · 癫痫发作终止

A bilingual research website connecting human electrophysiology, experimental mechanisms, clinical evidence and postictal recovery.

中英文科研网站，涵盖发作终止表型、超慢活动、网络转换、细胞与环路、干预窗口和发作后恢复。

## Website

GitHub Pages target: **https://seizure-termination.github.io/**. The deployment status is shown in this repository's Actions and Pages settings.

- Chinese: `/`
- English: `/en/`
- Use the language switch to open the corresponding page while retaining search filters.

## Local development

Requirements: Node.js 24 and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

Build and check:

```sh
pnpm run check
pnpm run build
pnpm run check:links
pnpm run preview
```

The local preview binds to `127.0.0.1:4321`. Browser checks use Playwright and an installed Chrome executable; set `CHROME_PATH` if necessary.

```sh
pnpm run test:browser
pnpm run test:bilingual
```

## Content and maintenance

- `src/data/papers.json`: publication metadata, Chinese summaries and evidence boundaries.
- `src/data/trials.json`: verified registry records, original outcomes and dates.
- `src/data/registry-verification.json`: reduced official fields used for validation.
- `src/data/en/content.json`: English research summaries, figure notes, topics and methods.
- `src/data/team.json`: the authorized public investigator profile and bibliography.
- `src/lib/site.ts` and `src/lib/english.ts`: Chinese and English page templates.
- `public/scripts/app.js`: local filtering, language switching and simulated waveforms.

Maintain matching IDs in both languages. Do not replace missing data with inferred numbers. Preserve source verification dates, original outcome definitions and the distinction between study status and efficacy. Run validation and rebuild after each content change.

Registry updates are manual: `pnpm run update:trials` writes review candidates to the ignored `sources/` directory. Review the differences before editing public data. The script does not automatically publish changes.

## Evidence and attribution

The initial collection contains 20 selected publications, including 6 with main-text and main-figure notes, and 5 verified ClinicalTrials.gov records. It is a curated resource, not an exhaustive systematic review. English translations do not constitute additional evidence.

All atlas examples are teaching simulations in arbitrary amplitude units, not patient or animal recordings. No patient upload, account system or clinical intake form is provided. The 3R model is a project-specific operational framework requiring validation.

The principal-investigator profile and public bibliography are reused with the user's authorization from the same group's [CDKL5 website](https://cdkl5-care.github.io/pi). The broader bibliography is not counted as seizure-termination evidence. Publisher figures are not reproduced.

## GitHub Pages deployment

For the organization site, use repository `seizure-termination/seizure-termination.github.io`, `SITE_URL=https://seizure-termination.github.io`, and `BASE_PATH=/`.

In **Settings → Pages**, choose **GitHub Actions**. In **Actions**, select **Publish reviewed site to GitHub Pages** and run the workflow with the confirmed site URL and base path. The workflow checks and builds before uploading the static artifact. After deployment, verify Chinese and English pages, deep links and 404 behavior.

To test a project subpath locally, set `BASE_PATH` to the intended path, provide `SITE_URL`, and build into a separate output directory. Do not upload development caches, source-download working files or local QA reports as website content.
