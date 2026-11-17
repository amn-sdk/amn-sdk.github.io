# Amine Saddik · Portfolio

**Live:** https://amn-sdk.github.io/ · Interactive 3D version: https://amn-sdk.github.io/matchday/

Personal portfolio of Amine Saddik, software engineer (AI, software engineering, 3D).
A fast single-page site with an animated Three.js hero and a detailed case study for every project.

## Features

- Hero with a real-time 3D scene (glass cubes, orbit ring, particle wave) loaded lazily
- Project grid filterable by domain, plus a case-study page per project (problem, role, architecture, challenges, results, team)
- Experience, education, skills and contact sections
- Dark and light themes, responsive layout, keyboard focus styles, `prefers-reduced-motion` support
- All content lives in one file: `src/content.ts`

## Stack

React 19 · TypeScript · Vite · Three.js · plain CSS

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Resume

The English and French resumes live in `public/resume/` (PDF + preview image) and are shown side by side on the `#/resume` page.

## Project structure

```
src/
├── content.ts            # profile, projects, experience, education, skills
├── App.tsx               # hash router (#/ and #/projects/<slug>) and theme
├── styles.css            # design tokens and all styles
└── components/
    ├── Nav.tsx
    ├── Home.tsx          # hero, projects, about, experience, education, contact
    ├── ProjectPage.tsx   # case-study layout
    ├── heroScene.ts      # Three.js hero scene
    ├── ProjectArt.tsx    # project image or generated cover
    └── Icons.tsx
public/images/projects/   # project screenshots
```

## Deployment

The build uses relative paths, so `dist/` can be served from GitHub Pages or any static host.

## License

MIT
