# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Standing authorization

The owner has granted standing permission to make code changes in this repository, and to
commit and push them, without asking for approval each time. Do not re-request permission
for ordinary edits, commits, or pushes here.

This does not extend to: force-pushing or rewriting published history, deleting branches or
the repository, changing the remote, or pushing to any *other* repository — in particular the
abandoned Azure DevOps copy (see below). Ask before any of those.

## Project

Angular 20 admin front end for the Anvaya Convention API (event and venue booking for a
convention centre). Originally built on a purchased admin theme ("cuba"); as of the UI
re-skin (2026-08) the unused ~95% of that theme — blog, e-commerce, email, chat, job-search,
gallery, the 68-component demo dashboard, and 91k lines of theme SCSS — has been deleted.
The application is now just `components/apps/admin/**` plus `auth/login` and `shared/**`.

The backend lives in a separate repository, `Anvaya_API`
(`D:\Sumita\Sumi\Project\Anvaya\Anvaya_API`, GitHub `SHGohil/Anvaya_API`). Its `CLAUDE.md`
documents the API's invariants. **When changing anything that crosses the wire, check both
repositories** — they are deployed separately and drift silently.

There is an older copy of this app at `D:\Sumita\Project\Anvaya Admin App` bound to Azure
DevOps (`CODE-FACTS/Anvaya Admin App`, branch `master`). It is abandoned. Do not push to it.

## Commands

```bash
npm install
npm start                        # ng serve, http://localhost:4200
npx ng build --configuration production
npm run lint                     # ESLint (angular-eslint); see eslint.config.js
```

There are no meaningful tests: `ng test` runs Karma against the theme's scaffolding, and
`e2e/` uses Protractor, which reached end of life in 2023.

## Architecture notes

### API access

`src/app/shared/services/*.service.ts` wrap the backend. **All API calls require a bearer
token** — every endpoint on the API except `POST api/Login` carries `[Authorize]`.

Services must not read the token in their constructor. `providedIn: 'root'` services are
constructed on first injection, which can happen before login, and
`JSON.parse(localStorage.getItem('user')).token` throws when nothing is stored. Read it at
call time instead.

### Environments

`src/environments/environment.ts` (dev) and `environment.prod.ts` both hold only
`backendAPIURL`. Point the dev one at a local or staging API — pointing it at production
means `ng serve` creates and approves real bookings.

### Styling

`src/assets/scss/_tokens.scss` overrides Bootstrap 5's SCSS variables (brand colour, radius,
shadow, type) before `src/styles.scss` imports `bootstrap/scss/bootstrap`, so the grid,
`card`, `btn`, `badge`, `form-control` etc. inherit the app's look without any template
changes. `_app.scss` defines the ~12 classes the real screens use that aren't stock
Bootstrap (`eventvenuename`, `chart-block`, `formg`, `errors`, `badge-xs`, …). `_icofont.scss`
carries only the two glyphs `calenderdates` actually uses, not the theme's full ~8,500-line
icon set.

### Known issues, not yet fixed

- Dependency audit: 8 advisories (0 critical) as of the last pass — down from 47. The
  remainder is `xlsx` (prototype pollution / ReDoS, no upstream fix) and `uuid` (pulled in
  transitively by `webpack-dev-server`, dev-only). Fixing either needs a package swap or an
  Angular major bump, not attempted here.
- `src/assets/images`, `src/assets/fonts` and `src/assets/video` still hold theme demo assets
  (~30 MB) that weren't audited for use — the re-skin only touched SCSS and components.
- ESLint reports ~486 findings, almost all pre-existing style debt (`no-var`,
  `@angular-eslint/prefer-inject`) unrelated to the re-skin.
- `calenderdates` and `dailyreport` still carry their original styling; they're flagged as
  the most work in the re-skin plan and haven't been restyled yet.
