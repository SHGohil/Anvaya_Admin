# CLAUDE.md

> **Unfinished work: read `HANDOFF.md` in this folder first.** It lists the pending Angular 22 branch and
> what still needs testing, in order.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Standing authorization

The owner has granted standing permission to make code changes in this repository, and to
commit and push them, without asking for approval each time. Do not re-request permission
for ordinary edits, commits, or pushes here.

This does not extend to: force-pushing or rewriting published history, deleting branches or
the repository, changing the remote, or pushing to any *other* repository — in particular the
abandoned Azure DevOps copy (see below). Ask before any of those.

## Project

Angular 22 admin front end for the Venexa Convention API (event and venue booking for a
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

### Roles and permissions in the UI

The API decides what each person may do; the UI only mirrors it. **Never check a role id in a template or
guard.** Ask `PermissionService` (`shared/services/permission.service.ts`) instead:
`perm.has('users.manage')`, `perm.scope('events.view')`, `perm.canEditEvents`.

- It loads `GET /api/me` once at startup (`provideAppInitializer` in `AppModule`) and keeps a copy in
  localStorage so the menu draws immediately; sign-out clears it.
- **Menu:** `NavService` has one list; each item names its permission and the menu is that list filtered by
  `PermissionService`. Headings with nothing visible under them are dropped. No per-role menus.
- **Routes:** `{ canActivate: [PermissionGuard], data: { permission: 'users.view' } }` (an array means "any of").
  Someone without it lands on the dashboard. This is a courtesy; the API enforces the same permission.
- **Roles screen** (`/settings/roles`, needs `roles.manage`): create roles, tick permissions grouped by area,
  choose All or Own where a permission supports it. Changes reach the people holding the role on their next
  request. The built-in Admin role is shown read-only.
- Adding a permission is an API change first (`Authorization/Permissions.cs`); the UI then just names it.

### Session renewal and paging

The API issues a 30-minute access token plus a rotating refresh token, both kept in the `user` object in localStorage. `AuthInterceptor` answers a 401 by calling `Login/refresh` once (concurrent calls share it), saves the new pair and retries; with no refresh token, or if renewal fails, it signs out. Sign-out calls `Login/logout` to revoke the refresh token. Long event lists should use `ReportsService.getEventsPage(status, page)`, which returns `{items, total}` from the API's `page`/`pageSize` and `X-Total-Count`.

### Editing the same event twice

Events carry a `rowVersion`. The calendar and daily-report edit forms remember it when an event is opened (`editRowVersion`) and send it back on Save; if someone else saved first the API answers 409 and the existing error dialog shows its message. Any new screen that edits an event must do the same.

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

- Dependency audit: 1 advisory after the Angular 22 upgrade — `xlsx` 0.18.5 (prototype pollution /
  ReDoS). The npm registry copy is abandoned; SheetJS publishes fixed builds only from their own CDN.
  It is the only finding in production dependencies.
- Still on the deprecated webpack builder (`@angular-devkit/build-angular:browser`). Moving to
  `@angular/build:application` is the next upgrade; run `ng update @angular/cli --name use-application-builder`.
- TypeScript 6 turns `strict` on by default; `tsconfig.base.json` sets `"strict": false` to keep the
  app's existing behaviour. Angular 22 made OnPush the default, so the update pinned every existing
  component to `ChangeDetectionStrategy.Eager`. Moving components to OnPush is a separate piece of work.
- `@ngx-translate` 18 has no `TranslateModule`: the pipe is imported directly in `SharedModule`, and
  `provideTranslateService` / `provideTranslateHttpLoader` are registered in `AppModule`.
- `src/assets/images`, `src/assets/fonts` and `src/assets/video` still hold theme demo assets
  (~30 MB) that weren't audited for use — the re-skin only touched SCSS and components.
- ESLint reports ~486 findings, almost all pre-existing style debt (`no-var`,
  `@angular-eslint/prefer-inject`) unrelated to the re-skin.
- `calenderdates` and `dailyreport` still carry their original styling; they're flagged as
  the most work in the re-skin plan and haven't been restyled yet.
