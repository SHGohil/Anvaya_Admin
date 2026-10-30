# Handoff: where the work stands (2026-10-29)

Read this first, then `CLAUDE.md`. Delete this file once every item below is done.

## State of the repo

- Branch `upgrade/angular-22` holds the Angular 20 -> 22 upgrade. **Nothing is committed or pushed.**
  `main` is untouched. Run `git status` and `git diff --stat` to see the pending change
  (about 60 files; most are mechanical migration edits).
- Done and verified: Angular 22.2, TypeScript 6.0.3, `ng-bootstrap` 21, `ng-select` 24,
  `ngx-translate` 18, `ng-apexcharts` 3 + `apexcharts` 8, `ngx-loading-bar` 7, `ngx-owl-carousel-o` 22,
  ESLint 10, rxjs 7.8. A strict `npm install` (no `--legacy-peer-deps`) resolves cleanly.
  `npx ng build --configuration production` exits 0.
- `npm audit`: 1 finding, `xlsx` 0.18.5 (only production dependency with an advisory).
- Runtime check done: the app starts with no Angular errors, login page renders, and with a fake
  localStorage user the shell (header, 13 sidebar links, translate pipe) renders.
- **Not tested at runtime:** any screen with real data. Dashboard charts (apexcharts 3 -> 8),
  `ng-select` dropdowns, `ng-bootstrap` modals/datepickers (v15 -> v21), the owl carousel, the Excel
  export in `dailyreport`. They compile but have not been exercised. Test these first.
- The API has a matching branch `upgrade/net10` in `Anvaya_API`; see its `HANDOFF.md`.

## Next steps, in order

1. Run the app against the local API (`dotnet run` in `Anvaya_API`, profile `AnvayaConventionAPI`) and
   click through every screen: dashboard, daily query, today's events, daily report (incl. Excel
   export), confirmed events, calendar, users, change requests, special dates, notifications,
   reset password. Fix whatever the library majors broke.
   Note the API's CORS default only allows `http://localhost:4200`; use that port or set
   `Cors__AllowedOrigins__0`.
2. Commit `upgrade/angular-22` (user has not asked for this yet; ask), then merge after step 1.
3. Move to the non-deprecated builder: `ng update @angular/cli --name use-application-builder`.
   `ng serve` currently prints a deprecation notice for `@angular-devkit/build-angular`.
4. `xlsx`: replace with SheetJS 0.20.3 from `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`
   (fixes both advisories). It is a non-registry dependency, so confirm with the user first.
5. Optional cleanups: move components from `ChangeDetectionStrategy.Eager` to OnPush; turn
   `strict` back on in `tsconfig.base.json` and fix what it reports; the ~500 ESLint findings;
   Sass `@import` -> `@use` (deprecation warnings on every build); unused theme assets (~30 MB);
   `package.json` name is still `cuba`.
6. Role-based access in the UI: **done in the working tree (2026-10-30)**, see "Roles and permissions in the UI"
   in `CLAUDE.md`. `PermissionService` + `PermissionGuard` + a permission-driven menu replace the three
   hardcoded role menus and every `loginroleid` check; new Roles screen. `AdminRoleGuard` is gone. Verified in a
   browser against the real local database (custom "Front Desk" role gets exactly its menu; forbidden URLs
   bounce to the dashboard). Also fixed the same day: Edit User no longer demands a password, the Excel export
   fills EventType and leaves BumpIn/BumpOut blank, Special Dates replaces its list on reload, the calendar
   grid refreshes after a save. Also done since: the session renews itself with the API refresh token (interceptor), Confirmed Events loads 50 at a time with a Load more button (API paging), the Special Dates header counts only the year shown, and changing a user's role asks for confirmation. Not yet exercised in a browser: token renewal, Load more, the role confirmation.
   current year (the API now keeps each date's real year); the Users screen has no role-change confirmation.

## What changed in the upgrade, in case something looks odd

- Every component has `changeDetection: ChangeDetectionStrategy.Eager` (Angular 22 made OnPush the
  default; the migration pinned existing components to keep behaviour).
- `main.ts` bootstraps with `provideZoneChangeDetection()` (Angular 21 made zoneless the default).
- `app.module.ts`: `provideHttpClient(withXhr(), withInterceptorsFromDi())` (added by migration) and
  `provideTranslateService(...)` + `provideTranslateHttpLoader({prefix:'./assets/i18n/', suffix:'.json'})`.
  `TranslateModule` no longer exists in ngx-translate 18; `SharedModule` imports/exports `TranslatePipe`.
- `tsconfig.base.json`: `strict: false` (TS 6 defaults it on), `moduleResolution: bundler`,
  target/module ES2022, and `paths: {"src/*": ["./src/*"]}` instead of the deprecated `baseUrl`
  (the app imports `src/app/...`). `extendedDiagnostics` blocks were removed from `tsconfig.app.json`
  and `tsconfig.spec.json` (Angular 22 rejects them with `strictTemplates: false`).
- The three key-press directives bind `attr.autocomplete`; `NgbdSortableHeader` click handler takes no
  `$event`; `typedata` in `addquery` is `any[]`; `HttpEvent`, `HttpInterceptor`, `ValidatorFn` are
  imported with the `type` modifier.

## Gotchas

- Port 4200 may already be taken by the user's own dev server. Use `node scripts/ng.js serve --port 4300`
  and do not kill the process on 4200.
- `ng update` refuses third-party peer conflicts; the intermediate hop used `--force` and
  `npm install --legacy-peer-deps`. The final state does not need either.
- Do not write `package.json` with PowerShell 5.1 `Set-Content -Encoding utf8`: the BOM breaks webpack's
  resolver. Use Node or `[System.IO.File]::WriteAllText` with `UTF8Encoding($false)`.
- `npm start` and `npm run build` go through `scripts/ng.js`, which raises the Node heap to 8 GB.
