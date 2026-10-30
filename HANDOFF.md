# Handoff: where the work stands (2026-10-30)

Read `CLAUDE.md` first.

## State

- **Everything is on `main` and pushed** (`SHGohil/Anvaya_Admin`, last commit `5be913a`). The old
  `upgrade/angular-22` branch was merged (fast-forward) and deleted. It covers the Angular 20 -> 22 upgrade, the
  role-based UI (permission-driven menu, guards, Roles screen), session renewal with refresh tokens, paged Confirmed
  Events, row-version-aware edit forms and the bug fixes found while testing.
- `npx ng build --configuration production` passes. There are no unit tests worth running (see `CLAUDE.md`).
- Checked in a browser against the real local API: login, token renewal after a 401, sign-out revoking the
  refresh token, Confirmed Events "Load more", and the role-based menu. **Not clicked through:** the role-change
  confirmation on Users, a real edit hitting the 409 "changed by someone else" message, the Excel export after
  the latest changes.
- **Not deployed anywhere yet.** It needs the current API `main` (`Anvaya_API`): the app calls `/api/me`,
  `Login/refresh`, `Login/logout`, and the paged `Events/{status}/status`. Deploy the API (and its migrations) first.

## Still to do

1. Deploy after the API (see `Anvaya_API/HANDOFF.md` for the order and the database checks).
2. `xlsx` 0.18.5 has two advisories; the fixed build is only on SheetJS's own CDN
   (`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`). Replacing it is a non-registry dependency, so confirm first.
3. Move to the non-deprecated builder: `ng update @angular/cli --name use-application-builder`.
4. Optional: components to OnPush, `strict` back on in `tsconfig.base.json`, the ~500 ESLint findings, Sass
   `@import` -> `@use`, unused theme assets (~30 MB), `package.json` name is still `cuba`.

## Gotchas

- `npm start` and `npm run build` go through `scripts/ng.js`, which raises the Node heap to 8 GB. If memory is tight,
  `npx ng build --output-path <scratch>/dist` plus a tiny static server is much lighter than `ng serve`; there is no
  `development` build configuration.
- Port 4200 may be taken by your own dev server; use `node scripts/ng.js serve --port 4300`.
- Do not write `package.json` with PowerShell 5.1 `Set-Content -Encoding utf8`: the BOM breaks webpack.
