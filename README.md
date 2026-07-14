# Nova Invest — Frontend (Vite)

Migrated off Create React App + craco onto **Vite**, since that old setup was what caused
the `npm install` peer-dependency errors (`react-day-picker` vs `date-fns`, plus CRA's own
webpack tooling conflicts). Same components, same pages, same styling — just a working,
modern dev server.

## What changed from the old CRA setup

- `craco start` / `craco build` → `vite` / `vite build` (scripts renamed to `dev` / `build` / `preview`)
- `src/index.js` → `src/main.jsx`, `src/App.js` → `src/App.jsx` (Vite convention; no other files needed renaming)
- `public/index.html` → moved to the project root, trimmed out leftover AI-builder branding/tracking scripts (Emergent badge, PostHog snippet) that had nothing to do with your app
- `process.env.REACT_APP_BACKEND_URL` → `import.meta.env.VITE_BACKEND_URL` (Vite's env convention — only one file used this, `src/lib/api.js`)
- Removed `react-scripts`, `@craco/craco`, `cra-template`, `@emergentbase/visual-edits`, and the giant `resolutions` block in `package.json` — those were all patches for CRA/webpack-specific dependency conflicts that don't exist under Vite
- Pinned `date-fns` to `3.6.0` to match what `react-day-picker@8.10.1` actually expects — this alone was half of your original `npm install` error
- Everything else (Radix UI, shadcn/ui components, Tailwind, React Query, React Hook Form, Recharts, etc.) is untouched — same versions, same code

## Run it

```bash
npm install
npm run dev
```

Should come up cleanly on **http://localhost:3000** with no `--legacy-peer-deps` or `--force` needed.

## Environment

`.env` now uses Vite's `VITE_` prefix (anything without it is invisible to client code):

```
VITE_BACKEND_URL=http://localhost:8000
```

Point this at wherever your Spring Boot backend is running.

## Build for production

```bash
npm run build    # outputs to /build, same as before
npm run preview  # locally preview the production build
```

## Notes

- `jsconfig.json` is still there purely for editor autocomplete on the `@/*` → `src/*` alias — the actual alias resolution now happens in `vite.config.js`.
- `components.json` (shadcn/ui config) is untouched; adding new shadcn components with the CLI should still work fine.
- If you had a `WDS_SOCKET_PORT` or `ENABLE_HEALTH_CHECK` env var in the old `.env` — those were webpack-dev-server/craco-specific and aren't needed anymore.
