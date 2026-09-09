# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

The git repository root is one level **above** this file; the Angular app lives in `connect-four/`.
Run every `npm`/`ng` command from `connect-four/`, not from the repo root.

## Angular constraints

- **Zoneless** (`provideZonelessChangeDetection()`) — state that drives the template must be a
  signal. Mutating a plain field, or mutating the array inside a signal, will not re-render.
- Standalone components only; no NgModules. Declare dependencies in the component's `imports` array.
- `strictTemplates` and TS `strict` are on, plus `noPropertyAccessFromIndexSignature` and
  `noImplicitReturns`.
- Use `input()` / `input.required()` / `output()` and `inject()` — not the `@Input`/`@Output`
  decorators or constructor injection.
- Angular Material 20 is a dependency and themed in `src/styles.scss` via `mat.theme()`, but no
  Material component is used yet — components are hand-rolled SCSS.

## Naming

Files under `src/app/components/` keep the `.component.ts` suffix (`board.component.ts`, class
`BoardComponent`, selector `app-board`). Follow that for new components even though `app.ts`/`App`
uses the newer suffix-less Angular 20 style — `angular.json` already sets
`@schematics/angular:component` to `type: "component"`, so `ng generate component` produces the
right names. Services use `*.service.ts`; models live in `src/app/model/` with no suffix.

## Board data model

`BoardService.board` is a `signal<Field[][]>` indexed **column-major and bottom-up**:
`board()[column][row]`, where `row` 0 is the lowest slot a disk falls into. Templates that need
top-down display reverse each column (see `BoardComponent.reversedBoard`).

Note the constants read inverted relative to standard Connect Four (`BOARD_HEIGHT = 7` is used as
the column length and `BOARD_POSITIONS = 6` as the column count, giving 6 columns of 7). Confirm the
intended dimensions before relying on them.

`addDisk` replaces the outer array and the touched column rather than mutating in place — required
under zoneless change detection. Keep that pattern.

## Deliberately unfinished

Missing features, not bugs — don't "fix" them incidentally:

- No turn state. `hasTurn` is hardcoded `true` on both players; the temporary "Add Red"/"Add Blue"
  buttons in `board.component.html` pick the player by hand.
- No win/draw detection or game-over state.
- `AddButtonComponent` renders a `+` with no column input and no click output.
- `PlayerComponent.remainingDisks` is filled by mutating the signal's array in `ngOnInit` and never
  decrements when a disk is played.

## Testing

`npm test` runs Karma + Jasmine in Chrome. `src/app/app.spec.ts` is still the CLI scaffold and
asserts an `<h1>` containing "Hello, connect-four" that `app.html` no longer renders — expect that
spec to fail until it is rewritten.

## Lint and format

- `npm run lint` — angular-eslint (flat config in `eslint.config.js`, `eslint-config-prettier` last
  so formatting rules never fight Prettier). It currently reports 6 pre-existing errors in
  `app.ts`, `board.component.ts`, `disk.component.ts`, `disk.ts` and `board.service.ts`; only fix
  those in files you are already touching.
- `npm run format` / `npm run format:check` — Prettier, configured in `package.json` (100 cols,
  single quotes, `angular` parser for HTML). The existing sources have **not** been formatted yet,
  so a repo-wide `npm run format` produces a large unrelated diff. Format only the files you change.
- 2-space indent per `.editorconfig`.

Strip the leftover `console.log` / `alert` debugging calls in `BoardService` when touching it.

## Git

Commit messages in this repo are short and lowercase ("added add button", "reversed board"), and
work goes directly onto `main`.
