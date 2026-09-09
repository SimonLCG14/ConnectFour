# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

The git repository root is one level **above** this file; the Angular app lives in `connect-four/`.
Run every `npm`/`ng` command from `connect-four/`, not from the repo root.

## Angular constraints

- **Zoneless** (`provideZonelessChangeDetection()`) — state that drives the template must be a
  signal. Mutating a plain field, or mutating the array inside a signal, will not re-render.
  TestBed setups need `provideZonelessChangeDetection()` too, services included, or specs fail
  with `NG0908`.
- Standalone components only; no NgModules. Declare dependencies in the component's `imports` array.
- `strictTemplates` and TS `strict` are on, plus `noPropertyAccessFromIndexSignature` and
  `noImplicitReturns`.
- Use `input()` / `input.required()` / `output()` and `inject()` — not the `@Input`/`@Output`
  decorators or constructor injection.
- Angular Material 20 is a dependency and themed in `src/styles.scss` via `mat.theme()`, but no
  Material component is used yet — components are hand-rolled SCSS over the `--mat-sys-*` variables.

## Naming

Files under `src/app/components/` keep the `.component.ts` suffix (`board.component.ts`, class
`BoardComponent`, selector `app-board`). Follow that for new components even though `app.ts`/`App`
uses the newer suffix-less Angular 20 style — `angular.json` already sets
`@schematics/angular:component` to `type: "component"`, so `ng generate component` produces the
right names. Services use `*.service.ts`; models live in `src/app/model/` with no suffix.

## Architecture

Two root-provided services split the game in half, and every component reads from them:

- **`BoardService`** — the 7x6 grid and the rules over it, and nothing else. `drop()` returns the
  landing row (or `null` when rejected), `findWinningLine()` scans the four axes outward from the
  cell just played, plus `isColumnFull` / `isFull` / `reset`.
- **`GameService`** — players, whose turn it is, and `GameStatus`. `play(column)` is the only entry
  point the UI calls; a rejected drop must not consume a turn. `remainingDisks()` is derived from
  the board rather than tracked separately, so the two can't drift apart.

Root-provided means game state survives router navigation between `/setup` and `/game`;
`gameConfiguredGuard` keeps `/game` unreachable until two players are seated.

### Board data model

`BoardService.board` is a `signal<Field[][]>` indexed **column-major and bottom-up**:
`board()[column][row]`, where `row` 0 is the lowest slot a disk falls into. `BoardComponent.columns`
reverses each column for top-down display and tags each slot with its real row, so nothing
downstream has to invert anything again.

`drop` replaces the outer array and the touched column rather than mutating in place — required
under zoneless change detection, and asserted by a spec. Keep that pattern.

### Drop animation

`animate.enter` only fires when an element **enters the DOM**, so `field-column.component.html`
renders the empty hole always and the `<app-disk>` conditionally. The fall distance comes from the
slot's top-down index, passed down as the `--fall-slots` custom property. Rendering an
always-present disk that merely changes colour would silently kill the animation.

## Testing

`npm test` runs Karma + Jasmine in Chrome; `npx ng test --watch=false --browsers=ChromeHeadless`
for a single non-interactive run. The rules services and the guard are specced; components are
verified in the browser.

Note that an empty suite still reports `SUCCESS` — check the executed count, not just the exit
status, when specs appear to pass suspiciously fast.

## Lint and format

- `npm run lint` — angular-eslint (flat config in `eslint.config.js`, `eslint-config-prettier` last
  so formatting rules never fight Prettier).
- `npm run format` / `npm run format:check` — Prettier, configured in `package.json` (100 cols,
  single quotes, `angular` parser for HTML). 2-space indent per `.editorconfig`.

## Git

Commit messages in this repo are short and lowercase ("added add button", "reversed board"), and
work goes directly onto `main`.
