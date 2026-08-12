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

Angular 16 admin front end for the Anvaya Convention API (event and venue booking for a
convention centre). Built on a purchased admin theme ("cuba"), which is why the repository
is much larger than the application: **only ~14 of 270 components are real application code**
(`components/apps/admin/**` plus `auth/login`). Everything else — blog, e-commerce, email,
chat, job-search, gallery, todo — is unused theme demo material.

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
npm run lint                     # tslint - deprecated, see below
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

### Dead code

`src/app/shared/services/` still contains services from an unrelated fleet/cab project —
`driver`, `trips`, `vehicletype`, `coupan`, `transmissiontype`, `hours`, `subscription`,
`aerialservice`, `triptaxservice`, `verificationstatus`. They are referenced by zero
components. Do not extend them; delete them when convenient.

### Known issues, not yet fixed

- Dependency audit reports ~150 advisories (6 critical), mostly through the theme's toolchain.
  Angular 16 is itself out of support.
- `tslint`, `protractor` and `codelyzer` are deprecated and should move to ESLint.
- The build output is ~52 MB, dominated by unused theme assets and a 1.4 MB stylesheet.
