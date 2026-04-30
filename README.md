# Sanskritized Hindi Lexicon

An open-source, etymology-based linguistic reference comparing Sanskrit-derived Hindi vocabulary with words from other historical sources (Persian, Arabic, Turkic, English).

This project is a structured archive — **not** a purity tool, correction tool, or political tool. It exists purely as an educational and academic resource.

---

## ✨ Features

### Content & Language
- **500+ curated concepts** with Sanskrit-derived and other historical equivalents
- **Devanagari, Romanization, and IPA** for every entry
- **Registry tags** (formal, colloquial, classical, literary, religious, philosophical, administrative, legal, academic, technical, archaic)
- **11 thematic categories** (Nature, Governance, Abstract Concepts, etc.)
- **Full Hindi mode** — entire UI, definitions, categories, and tags translated into shuddha (Sanskritized) Hindi
- **Antonyms** support for relevant entries

### Pages
- **Home** — searchable browsable lexicon with infinite scroll
- **Categories** — thematic grouping of all words
- **Learn** — flashcard mode with keyboard navigation, shuffle, audio, and category filtering
- **Replace** — text tool that swaps non-Sanskrit words for Sanskrit equivalents (script-preserving)
- **Word of the Day** — date-seeded, no-repeat selection
- **About** — project philosophy, neutrality statement, language background

### UX
- **Animated header** cycling between English / Devanagari / IPA (4s cycle)
- **Audio pronunciation** via Web Speech Synthesis API
- **Search** with NFD normalization (diacritic-insensitive)
- **Infinite scroll** + scroll-to-top
- **Persistent preferences** in localStorage (text size, contrast, dark mode, Hindi mode, learn category)
- **Dark mode** + **high contrast** mode
- **Text scaling** (default / large / xl)
- **Mobile-first responsive** layout
- **Custom Sanskrit-themed favicon**

### Engineering
- **Lazy loading** of pages and word data
- **Input hardening** — debouncing, max-length limits, XSS prevention
- **Runtime guards** against undefined word states
- **Validated JSON schema** with strict registry tags (max 2 per word)
- **Deduplicated dataset** with 100% Hindi translation parity
- **Static build** — no SSR, no dynamic routes

---

## 🛠 Tech Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS v3** with semantic design tokens (HSL)
- **shadcn/ui** components
- **React Router** for client-side routing
- **Vitest** for testing

---

## 🎨 Design

Minimalist, academic aesthetic:
- Off-white background (`#FAFAF9`)
- Muted saffron accents
- No gradients (single exception: Word of the Day card)
- High contrast, color is never the only signifier

---

## 🚀 Getting Started

```sh
# Install
npm i

# Develop
npm run dev

# Build
npm run build

# Test
npx vitest run
```

---

## 📁 Data

All vocabulary lives in a single source of truth:

```
src/data/words.json          # Concepts, words, tags
src/data/descriptions_hi.ts  # Hindi (Sanskritized) definitions
src/lib/translations.ts      # UI string translations
```

Schema (per concept):
```ts
{
  english: string;
  category: string;          // one of 11 allowed categories
  description: string;
  sanskrit_derived: WordEntry[];
  other_historical_sources: WordEntry[];
  antonyms?: string[];
}
```

Each `WordEntry` contains `dev`, `roman`, `ipa`, and up to 2 `tags`.

---

## 🤝 Contributing

Contributions are welcome. Please maintain:
- A **neutral, academic tone** — no purist or political framing
- The **fixed JSON schema** and **allowed registry tags**
- **Hindi translation parity** when adding new English entries
- High contrast and accessibility standards

---

## 📜 License

Open source. See repository for license details.

> *This is a linguistic archive. Not a correction tool. Not a political tool. Not a purity tool.*
