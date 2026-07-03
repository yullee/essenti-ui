# CLAUDE.md

A React design system library (npm package) for building multiple products.
It is intentionally kept domain-agnostic.
Rules are finalized constraints. Do not modify. If conflict occurs, ask.

## Scope

- Library for npm consumption (not an app)
- Portfolio scope → optimize for judgment, not completeness
- Prefer minimal architecture with clear separation of concerns

## Evaluation rule

A decision is valid only if it:

- reduces unnecessary complexity
- improves accessibility or correctness
- improves consumer clarity
- demonstrates separation of concerns

Otherwise it is over-engineering.

## Design Direction

- Focus areas: simplicity, whitespace, restraint, structurally predictable
- Density: medium (4px base, 8px rhythm)
- Typography: Inter (primary)

Borders = semantic separators only.
Depth = tone/lightness (no shadow-driven hierarchy).

## UI Abstraction Model

All components follow a shared 4-layer architecture

### 1. Behavior Layer

- state management (loading, disabled, active, etc.)
- interaction handling (click, keyboard, focus)
- polymorphic behavior (as prop where applicable)

### 2. Structure Layer

- DOM structure and composition
- slot architecture (content, icon, label, etc.)
- element hierarchy

### 3. Accessibility Layer

- ARIA attributes (aria-*)
- semantic role mapping
- keyboard navigation support
- form wiring (label, description, error linkage)

### 4. Styling Layer

- semantic tokens only (no raw values)
- variant mapping (primary, secondary, ghost, etc.)
- size system (sm, md, lg)
- layout modifiers (e.g. fullWidth)

## Tokens (strict)

Style Dictionary v4 (DTCG)

Tier model:

- Primitive: raw values (NOT used in UI)
- Semantic: UI contract layer (ONLY layer used by components)

Rule: ESLint custom rules enforce semantic token usage. Primitive token imports are forbidden.
Dark mode = semantic remapping only (no component logic changes).

## Packaging

- React library (ESM, tsup)
- per-component exports
- React is peerDependency (^18 || ^19)

Rule: Never bundle React (avoid runtime duplication issues).
Base UI: headless behavior layer (peerDep if duplication risk).

## CSS Strategy

Dev: Tailwind. Ship: compiled `dist/styles.css` only.

Consumer:
import "@repo/ui/styles.css";

Rule:

- Must work in a blank project with no Tailwind config (styles.css alone)
- If blocked, do not bypass constraints. Stop and ask for guidance.

## Components

All components MUST implement UI Abstraction Model layers explicitly.

Core UI primitives:

- Button: interaction states, variants, polymorphism, focus
- Input + Field: form accessibility wiring, label/description/error
- Table: density system, composition API, accessibility, structure

Rule: Components are organized around distinct UI problem spaces.

## Constraints

- forwardRef required
- composition over configuration
- semantic tokens only (no raw values)
- cn() only for class merge
- WCAG AA baseline via headless primitives

Table:

- horizontal dividers only
- no vertical borders
- density via data-density

## Workflow

- One phase → implement → verify → stop. No batching.
- Must verify via real build/run. "It works" is invalid without observable output.
- Conventional Commits, lowercase (e.g. `feat: add button component`).
- AI does NOT commit. After verify, stop and propose change summary + commit message. Human commits.
- If stuck or conflicting with a rule, do not work around — ask first.

## Deferred

- multi-brand system
- tier 3 tokens
- CI/CD, changesets, generators
- visual regression tools
- lint enforcement systems

Reason: excluded due to operational overhead vs portfolio signal.
