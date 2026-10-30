# Handoff: where the work stands (2026-10-31)

Read `CLAUDE.md` first.

## State

- **Everything is on `main` and pushed** (`SHGohil/Anvaya_Admin`). The app was renamed to **Venexa** and given a
  completely new UI: new theme (`src/assets/ui/theme.css`, light and dark), responsive shell, every screen rewritten,
  new login page, Bootstrap and ng-bootstrap removed, all old theme images/fonts/video deleted. Earlier work on `main`:
  the Angular 20 -> 22 upgrade, the permission-driven menu, guards and Roles screen, session renewal with refresh
  tokens, paged Confirmed Events and row-version-aware edit forms.
- `npx ng build --configuration production` passes. There are no unit tests worth running (see `CLAUDE.md`).
- Checked in a browser on 2026-10-31 against the local API: all 12 routes as an Admin (no console errors, no failed
  API calls, no sideways overflow at 390 px), the permission-limited Sales Manager (menu filtered, `/settings/users`
  and `/settings/roles` redirect to the dashboard, lists limited to their own events), pop-ups, menus and dark mode.
  **Not checked:** a real Save from the edit forms or a real 409 "changed by someone else" (the API tests cover the
  server side), the Excel export (it triggers a download), a real phone, sign-in with a real password.
- **Not deployed anywhere yet.** It needs the current API `main` (`Anvaya_API`): the app calls `/api/me`,
  `Login/refresh`, `Login/logout`, the paged `Events/{status}/status`, and the edit forms need the API's `VenueIds` fix
  (without it the venue box opens empty). Deploy the API (and its migrations) first.

## Brand

The visible name is Venexa. The logo is a **placeholder** mark drawn for this project: replace
`src/assets/brand/venexa-mark.svg` and `favicon.svg` with the real logo (the sidebar, login page and browser tab read
them from there). Unchanged on purpose: the live API hostname in `environment.prod.ts`, the GitHub repo and folder
names (`Anvaya_Admin`, `Anvaya_API`; renaming a repo changes the remote, so ask the owner first) and `package.json`'s
name. `src/environments/environment.prod.ts` points at the live server, so **never check a production build in a browser
with test tokens**; use `ng serve`, whose environment points at the local API.

## Still to do

1. Deploy after the API (see `Anvaya_API/HANDOFF.md` for the order and the database checks).
2. `xlsx` 0.18.5 has two advisories (`npm audit`); the fixed build is only on SheetJS's own CDN
   (`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`). Replacing it is a non-registry dependency, so confirm first.
3. (Done 2026-10-31) The app builds with the new `@angular/build:application` builder; output is still `dist/cuba` (`outputPath.browser` is "").
4. Check that the **live** API really enforces sign-in. During testing it appeared to answer a request carrying a made-up
   token (not confirmed). The API in this repo's sibling does enforce it.
5. Optional: components to OnPush, `strict` back on in `tsconfig.base.json`, the ~400 ESLint findings (`npm run lint`,
   old style debt), Sass `@import` -> `@use`, `package.json` name is still `cuba`, dead carousel options in
   `calenderdates.component.ts`.

## Gotchas

- `npm start` and `npm run build` go through `scripts/ng.js`, which raises the Node heap to 8 GB. There is no
  `development` build configuration. The dev server is now Vite-based; it prints `Local: http://localhost:4200/`.
- Port 4200 may be taken by your own dev server (or a leftover of an earlier one: `netstat -ano | findstr :4200`); use
  `node scripts/ng.js serve --port 4300` and add that origin to the API's `Cors:AllowedOrigins`.
- Do not write `package.json` with PowerShell 5.1 `Set-Content -Encoding utf8`: the BOM breaks webpack.
- Pop-ups use `ModalService`, not `NgbModal`; row menus use the CDK menu. See "Styling" in `CLAUDE.md`.
