# Contributing

Thank you for considering a contribution to Sanskritized Hindi Lexicon.

This project is a linguistic archive. Contributions should improve accuracy,
clarity, accessibility, maintainability, or the breadth of the archive without
turning the project into a prescriptive language tool.

## Contribution License

This repository is source-available, not open source. You may create temporary
forks, branches, or local copies solely to prepare contributions to the
official repository. Please do not publish, rebrand, host, sell, or maintain a
separate copy of the project.

By submitting an issue, patch, pull request, suggestion, or other contribution,
you confirm that you have the right to submit it and you grant Rushil Rawat and
the official Sanskritized Hindi Lexicon project a perpetual, worldwide,
royalty-free, irrevocable, sublicensable license to use, reproduce, modify,
publish, distribute, display, perform, and incorporate that contribution into
the project and related materials.

You retain copyright in your contribution.

## Ways to Contribute

- Add or correct word entries.
- Improve Devanagari, romanization, or IPA.
- Improve category or tag consistency.
- Add tests for search, replacement, or validation logic.
- Improve accessibility and responsive behavior.
- Improve documentation.
- Report bugs with clear reproduction steps.

## Development Setup

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint
npm run test
npm run build
```

## Dataset Guidelines

Vocabulary data lives in:

```text
src/data/words.json
```

Each concept should include:

- `english`
- `category`
- `description`
- `sanskrit_derived`
- `other_historical_sources`
- optional `antonyms`

Each word entry should include:

- `dev`
- `roman`
- `ipa`
- `tags`

Use only the controlled tags defined in:

```text
src/types/word.ts
src/lib/constants.ts
```

Keep tags concise. A word entry should not have more than two tags.

## Tone and Neutrality

This archive documents linguistic history. Please avoid:

- purity claims
- political framing
- ranking words by origin
- dismissive language about any linguistic tradition

Prefer precise, neutral, source-aware language.

## Pull Request Checklist

- The change is scoped and intentional.
- New data follows the schema.
- Search/replacement behavior is tested when changed.
- UI changes are responsive.
- Documentation is updated when needed.
- `npm run lint`, `npm run test`, and `npm run build` pass.
