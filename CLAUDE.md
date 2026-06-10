# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TambakAI** is an AI-powered shrimp farm feeding control system (Sistem Kontrol Pemberian Makan Pada Tambak Udang). The application helps shrimp farm owners optimize feed quantity and timing to improve harvest quality and yields.

### Target Users
Shrimp farm owners (petambak udang) who need daily feeding recommendations.

### Core Functionality
- **Inputs (7 parameters)**: pH levels, water temperature, weather conditions, shrimp species, shrimp count, shrimp age, water volume
- **Outputs**: Feed quantity (kg), feeding schedules, and explanations/justifications based on fuzzy logic analysis

### AI Method: Sugeno Fuzzy Logic
The system uses the **Sugeno method** (Sugeno-type fuzzy inference system) to determine optimal feed quantities:
- Uses fuzzy rules to map sensor inputs to feeding recommendations
- Outputs constant or linear functions (rather than fuzzy sets like Mamdani)
- Well-suited for real-time control systems and optimization problems
- Processes multiple input variables to calculate precise feed quantities

## System Design

### Input Parameters (7 total)

| Input | Type | Description |
|-------|------|-------------|
| pH Air | Number (decimal) | Water acidity level |
| Suhu Air | Number (decimal, °C) | Water temperature |
| Cuaca | Dropdown | Weather: Cerah, Berawan, Hujan, Badai |
| Volume Air | Number (decimal, m³) | Pond water volume |
| Jenis Udang | Dropdown | Species: Vannamei, Monodon, etc. |
| Jumlah Udang | Number (integer) | Estimated current shrimp count |
| Usia Udang | Number (integer, hari) | Shrimp age in days |

### Output Structure

1. **Kuantitas Pakan Harian** - Total feed amount in kg
2. **Jadwal Pemberian** - Feeding schedule with timing (pagi/siang/sore) and amounts
3. **Analisis & Penjelasan** - Justification breakdown:
   - Kondisi Air analysis (pH, suhu status)
   - Kondisi Tambak analysis (kepadatan)
   - Kondisi Udang analysis (usia, estimasi berat)
   - Rekomendasi Pakan (FCR, feeding rate, biomassa)

### Additional Features
- **Riwayat** - Save and view historical recommendations (LocalStorage)
- **Export PDF** - Download recommendation as PDF document

## Fuzzy Logic Architecture

```
INPUT → FUZZIFICATION → RULE EVALUATION → DEFUZZIFICATION → OUTPUT
```

**Fuzzy Sets:**
- pH: {Asam, Normal, Basa}
- Suhu: {Dingin, Normal, Panas}
- Cuaca: {Cerah, Berawan, Hujan, Badai}
- Kepadatan (dihitung dari jml/volume): {Rendah, Normal, Tinggi}
- Usia: {Benur, Pembesaran, Panen}
- Jenis: {Vannamei, Monodon, Lainnya}

**Calculation Formula:**
```
Biomassa = Jumlah Udang × Berat per Udang (berdasarkan usia & jenis)
Daily Feed = Biomassa × Feeding Rate × FCR (Feed Conversion Ratio)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.2.7 (App Router)
- **React**: 19.2.4
- **React Compiler**: Enabled via `babel-plugin-react-compiler`
- **Language**: JavaScript with path aliases via jsconfig.json
- **PDF Export**: jsPDF (to be added)

### Project Structure
```
src/
└── app/
    ├── layout.js              # Root layout with Geist fonts
    ├── page.js                # Main page (form + hasil)
    ├── globals.css            # Global styles
    ├── page.module.css        # Page-specific styles
    ├── lib/
    │   └── fuzzyLogic.js      # Fuzzy logic engine (custom implementation)
    ├── components/
    │   ├── InputForm.js       # Form input component
    │   ├── ResultCard.js     # Display hasil rekomendasi
    │   └── HistoryList.js    # Riwayat rekomendasi
    └── utils/
        ├── pdfExport.js       # PDF generation helper
        └── storage.js         # LocalStorage helper
public/                       # Static assets
```

### Key Configuration

**Path Aliases** (`jsconfig.json`):
```js
"@/*" → "./src/*"
```

**React Compiler** (`next.config.mjs`):
- Enabled via `reactCompiler: true`
- Automatic optimizations for React components

### UI Approach
- **Single page form** - All inputs on one page with "Hitung Rekomendasi" button
- **Results display** - Shows after calculation with complete analysis
- **CSS Modules** - Component-level styling with `*.module.css`

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Dependencies
npm install jspdf    # Add PDF export library
```

## Development Notes

- The project is in early development stage - transitioning from default create-next-app template to TambakAI implementation
- All code uses JavaScript (not TypeScript)
- Component-level styling uses CSS Modules (`*.module.css`)
- ESLint is configured with Next.js core-web-vitals preset
- Fuzzy logic is implemented from scratch (custom, not using external fuzzy library)
- Data persistence uses LocalStorage for simplicity (no backend required for MVP)
