# 📚 Sanskritized Hindi Lexicon

![Vite](https://img.shields.io/badge/Build-Vite-purple?logo=vite)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38BDF8?logo=tailwindcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An open-source, etymology-driven linguistic reference comparing **Sanskrit-derived Hindi vocabulary** with words from other historical sources (Persian, Arabic, Turkic, English).

This project is a structured archive — **not** a purity tool, correction tool, or political tool. It exists purely as an educational and academic resource.

---

## 🌐 Overview

The Sanskritized Hindi Lexicon is designed to explore how vocabulary in modern Hindi evolves across linguistic histories. It provides structured comparisons, phonetic representations, and contextual usage — all within a clean, modern web interface.

The goal is **clarity, accessibility, and linguistic transparency**, not prescription.

---

## ✨ Features

### 🧠 Content & Language
- **500+ curated concepts** with Sanskrit-derived and alternate historical equivalents
- Full **Devanagari, Romanization, and IPA** for each word
- **Registry tags** (formal, colloquial, classical, literary, legal, technical, etc.)
- **11 thematic categories** (Nature, Governance, Abstract Concepts, etc.)
- **Antonyms support** where applicable
- **100% Hindi (Sanskritized) translation parity**

---

### 📄 Core Pages

- **Home** — searchable lexicon with infinite scroll
- **Categories** — structured thematic exploration
- **Learn** — flashcard system with:
  - keyboard navigation
  - shuffle mode
  - audio pronunciation
  - category filtering
- **Replace Tool** — transforms text using Sanskrit-derived equivalents (script-preserving)
- **Word of the Day** — deterministic, non-repeating selection
- **About** — philosophy, neutrality, and linguistic context

---

### 🎨 UX & Accessibility

- **Animated multilingual header** (English / Devanagari / IPA cycling)
- **Audio pronunciation** via Web Speech API
- **Fuzzy search with NFD normalization** (diacritic-insensitive)
- **Infinite scroll + scroll-to-top**
- **Persistent preferences** (localStorage):
  - dark mode
  - high contrast mode
  - text scaling
  - Hindi mode
- **Mobile-first responsive design**
- **Accessible color system** (contrast-safe, no color-only signals)

---

### ⚙️ Engineering Highlights

- **Lazy-loaded pages and datasets** for performance
- **Debounced search input + input constraints**
- **XSS-safe rendering and runtime guards**
- **Strict JSON schema validation**
- **Controlled vocabulary system (max 2 tags per word)**
- **Deduplicated dataset with enforced consistency**
- **Fully static build (no SSR, no dynamic routing)**

---

## 🛠 Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React 18 + TypeScript 5 |
| Build Tool   | Vite 5 |
| Styling      | Tailwind CSS v3 |
| UI System    | shadcn/ui |
| Routing      | React Router |
| Testing      | Vitest |
| State        | LocalStorage + React state |

---

## 🎨 Design Philosophy

Minimalist, academic aesthetic:

- Off-white base (`#FAFAF9`)
- Muted saffron accents
- No visual noise or gradients *(except Word of the Day)*
- High readability and contrast-first design
- Language-first interface prioritization

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Run tests
npx vitest run
```

## 📁 Project Structure

```
src/
├── components/        # UI components
├── pages/             # Application views
├── data/              # Core dataset
│   ├── words.json
│   ├── descriptions_hi.ts
├── lib/               # Utilities and translations
│   ├── translations.ts
├── hooks/             # Custom hooks
└── main.tsx           # Entry point
```
---
## 📊 Data Model

All vocabulary is maintained in a structured schema:

```
{
  english: string;
  category: string;
  description: string;
  sanskrit_derived: WordEntry[];
  other_historical_sources: WordEntry[];
  antonyms?: string[];
}
```
Each `WordEntry` includes:

- `dev` (Devanagari)
- `roman`
- `ipa`
- `tags` (max 2, from controlled vocabulary)

---

## 🎯 What This Project Demonstrates

Large-scale structured dataset design
Thoughtful UX for linguistic tools
Strong frontend architecture (React + TS)
Performance-focused static web engineering
Real-world search + normalization systems

> This is a linguistic archive. Not a correction tool. Not a political tool. Not a purity tool.
