## Quick Start

- npm install
- npm run dev          
- npm run storybook   
- npm test            
- npm run test:coverage

<img width="1026" height="685" alt="image" src="https://github.com/user-attachments/assets/2687169d-69da-4e1c-a444-a721a7ebed6d" />
<img width="378" height="818" alt="image" src="https://github.com/user-attachments/assets/c537f413-7602-4fd1-baec-aab026d0be31" />

# Test Coverage Tests:
 
 <img width="604" height="443" alt="image" src="https://github.com/user-attachments/assets/c2dbed51-4bc8-45dd-83ba-010086d3067e" />

 #  Tests:
 
 <img width="599" height="254" alt="image" src="https://github.com/user-attachments/assets/a0e9e2a5-264a-426a-a712-7294b001d004" />

 # Storybook with accessibility checks:
 
 <img width="1374" height="871" alt="image" src="https://github.com/user-attachments/assets/1da46285-8611-4919-a10c-498bf87c7e84" />

---

## Stack

Tool | Purpose
---|---
Vue 3 `<script setup>` + Composition API | UI framework and reactive patterns
TypeScript | Strict typing across components, composables, and store logic
Vite | Dev server, bundling, HMR, and fast build
Pinia (Composition API style) | State management for betslip and odds updates
Tailwind CSS v4 | Utility-first styling with `@theme` tokens and no separate config file
Vitest + `@vue/test-utils` | Unit and integration tests for components and composables
axe-core | Automated accessibility checks in Vitest tests
Storybook v10 + `@storybook/addon-a11y` | Component explorer with accessibility reporting
`@vitest/coverage-v8` | Coverage reporting for TypeScript and Vue SFCs
ESLint + Prettier | Linting and formatting consistency

---

## Features Implemented

### In-Play Matches

- Polls `/api-{n}.json` every 5 seconds and clears the interval on unmount to avoid leaks
- Game tabs are derived from live matches, sorted alphabetically, and the first tab is pre-selected
- Switching tabs filters the match list by game
- Responsive layout: inline odds on desktop, stacked mobile odds below team rows
- Mobile tab strip scrolls horizontally to support many games

### Betslip

- Odds buttons toggle contract selection in the betslip
- Desktop layout uses a right sidebar; mobile layout renders betslip below the main content
- Odds direction is tracked against the snapshot taken when the contract was added
- `updateAllOdds` only mutates `currentOdds`, preserving the original `initialOdds` for direction logic

---

## Accessibility

Accessibility is treated as a first-class requirement in component behavior and tests.

### ARIA implementation

Element | ARIA | Why
---|---|---
Odds buttons | `aria-pressed`, `aria-label` | Toggle buttons with descriptive labels and state
Game tab strip | `role="tablist"` | Semantic tab container pattern
Game tab buttons | `role="tab"`, `aria-selected` | Correct tab semantics for screen readers
Remove button | `aria-label="Remove {team} from betslip"` | Clear action description for assistive tech

### Automated checks — Vitest

- Uses axe-core with a helper to validate DOM output in component tests
- Violations fail the test with impact, rule ID, help URL, and node details
- Color contrast is excluded from axe-core in jsdom because it cannot compute real rendered values reliably

### Storybook checks

- Storybook is configured with `@storybook/addon-a11y`
- This enables real browser accessibility reporting on individual stories
- Designers and QA can open Storybook and inspect violations live in the Accessibility panel

---

## Testing

npm test               
npm run test:coverage  
### Coverage

Coverage is collected with `@vitest/coverage-v8` and configured for `src/**/*.{ts,vue}`.
Thresholds are enforced at 80% for statements, branches, functions, and lines.

### Test layers

Layer | Tool | What it covers
---|---|---
Store unit | Vitest | `betslip` store actions, getters, odds tracking
Composable unit | Vitest | `useInPlay` sorting, pre-selection, filtering logic
Component | Vitest + `@vue/test-utils` | Rendering, interaction, reactive props, ARIA attributes
Accessibility | axe-core in Vitest | WCAG-focused ARIA and role checks
Integration | Vitest + fake timers | Fetch polling, betslip sync, interval cleanup
Visual + accessibility | Storybook + addon-a11y | Story-level accessibility validation in browser

---

## Architecture

`src/`

- `App.vue` — root app shell, fetch loop, layout, and betslip sync
- `types/index.ts` — domain interfaces and shared data shapes
- `stores/betslip.ts` — Pinia store managing betslip state and odds updates
- `composables/useInPlay.ts` — game selection and match filtering logic extracted for testability
- `components/`
  - `gameTabs/` — horizontal scrolling game tab strip
  - `inPlayContainer/` — orchestrates tabs and match rows
  - `matchRow/` — renders a single match and responsive odds layout
  - `oddsButton/` — toggle button for adding/removing a contract
  - `betslip/` — betslip panel and item display with direction indicator

Each component folder contains a Vue component, stories, and tests.

### Key decisions

- `useInPlay` is extracted from `InPlayContainer` so filtering can be tested without DOM mounting
- Pinia is used with Composition API style to match `<script setup>` idioms and keep store logic testable
- Odds direction is computed against the initial snapshot stored when a contract is added, not relative to the previous poll
- `@vitest/coverage-v8` is the project coverage provider, with source-aware support for Vue SFCs and TypeScript




