
# MTP Administrative Atlas

## Project
A Digital Humanities research website exploring the administrative production and delivery of income certificates across Rajasthan, Kerala, Karnataka and Bihar.

## Current development scope
Build only the Administrative Landscape. Do not implement future modules yet.

## Technology
- React
- Vite
- TypeScript
- Custom CSS
- lucide-react

## Visual identity
Create a sophisticated editorial research atlas, not a generic SaaS dashboard.

Use:
- Warm ivory background
- Charcoal typography
- Muted terracotta, olive, indigo and ochre
- Editorial typography and generous whitespace
- Fine borders and restrained shadows
- Cartographic and archival visual language
- Subtle transitions

Avoid:
- Neon gradients
- Generic stock images
- Excessive rounded cards
- Decorative charts
- Unnecessary animations

## State cases
- Rajasthan: historical Board of Revenue circulars and e-Mitra context.
- Kerala: e-District, Akshaya and Revenue administration.
- Karnataka: Nadakacheri, Seva Sindhu and Seva One.
- Bihar: RTPS, BiharOne and Revenue administration.

## Current research collection snapshot
- 4 state case profiles
- 19 registered source records
- 119 extracted content records
- 93 machine-screened evidence candidates
- 0 verified evidence entries

These are collection statistics, not findings about state performance.

## Source distribution
- Rajasthan: 4 registered sources
- Kerala: 6 registered sources
- Karnataka: 4 registered sources
- Bihar: 5 registered sources

## Research integrity
- Never invent evidence or administrative procedures.
- Never rank states.
- Distinguish registered sources, extracted records, unverified candidates and verified evidence.
- Label missing information "Not yet established".
- Clearly distinguish historical sources from current information.
- Do not imply equal source coverage across states.

## Data architecture
- Keep data separate from UI components.
- Read public research data from JSON files.
- Never connect the public website directly to SQLite or Google Drive.
- Never put private databases or raw research files in public folders.

## First deliverable
1. Header and navigation
2. Editorial hero section
3. Four-state administrative landscape explorer
4. State profile panels
5. Research collection statistics
6. Source coverage section
7. Research methodology note
8. Footer

## Map
Do not fabricate state boundaries. Use a designed state locator until properly sourced geographic data is available.

## Code quality
Use reusable React components, TypeScript interfaces, accessible controls, responsive layouts and separate CSS files.
Do not put the entire application in App.tsx.
Run npm run build and fix errors.
