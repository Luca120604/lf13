# Roland Radar

Fahrrad-App für den **Schwarzwald / Kinzigtal** (z. B. Schenkenzell).
Kombiniert Routen, Bilder und einen einfachen **Vitalcheck** vor & nach der Fahrt.

> MVP. Keine medizinische Aussage — nur Orientierung.

## Features

- **Routen finden** — Filter nach Startort, Dauer, Schwierigkeit, E-Bike, Rundtour/A→B
- **Eigene Route hochladen** — Name, Strecke, Höhenmeter, Bilder, Links zu Google Maps / Komoot / Outdooractive
- **Routen-Detail** — Deep-Links zu Google Maps, Apple Karten (iOS), Komoot, Outdooractive
- **Vitalcheck vor / nach der Fahrt** — 5 Fragen à ⭐ 1–5, plus Wasser-Counter und Foto/Screenshot-Upload (Blutdruck, Smartwatch)
- **Einfache Auswertung** — Hinweistexte basierend auf den Sternen ("könnte sein" / "möglicherweise")
- **Verlauf** — alle Checks lokal gespeichert
- **PWA** — installierbar, offline-fähig
- **Lokale Speicherung** — alles in `localStorage`, kein Backend nötig

## Tech

- React 18 + Vite
- Tailwind CSS
- `vite-plugin-pwa` (Workbox, autoUpdate)
- localStorage für Routen, Vitalchecks und Bilder (DataURL)

## Schnellstart

```bash
npm install
npm run dev
```

Läuft auf http://localhost:5173.

```bash
npm run build     # Produktionsbuild → dist/
npm run preview   # Build lokal anschauen
```

## Projektstruktur

```
src/
  App.jsx                  # View-Routing per State
  main.jsx
  index.css                # Tailwind + Komponenten-Klassen
  components/
    StarRating.jsx         # ⭐ 1–5
    RouteCard.jsx          # Card in Listen
    DeepLinkButtons.jsx    # Google/Apple/Komoot/Outdooractive
    ImageUpload.jsx        # Foto/Screenshot-Upload (DataURL)
  pages/
    Home.jsx
    RouteFinder.jsx        # Filter
    RouteUpload.jsx        # Eigene Route erfassen
    RouteList.jsx
    RouteDetail.jsx
    VitalCheck.jsx         # mode="pre" | "post"
    History.jsx            # Verlauf der Checks
  data/routes.js           # Seed-Routen Kinzigtal
  hooks/useLocalStorage.js
public/
  icon-192.svg, icon-512.svg, favicon.svg
```

## localStorage Keys

| Key              | Inhalt                             |
| ---------------- | ---------------------------------- |
| `roland.routes`  | selbst erfasste Routen             |
| `roland.checks`  | Vitalcheck-Historie inkl. Bilder   |

## Deployment (kostenlose Optionen)

Da die App ein reines Static-Build ist (`dist/`), läuft sie auf jedem Static Host:

### Cloudflare Pages (empfohlen, kostenlos)

1. GitHub-Repo in Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
2. Repo `luca120604/lf13` auswählen, Branch z. B. `main`
3. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Deploy. Jeder Push auf `main` deployt automatisch.

Optional per CLI mit Wrangler:

```bash
npm i -D wrangler
npx wrangler pages deploy dist --project-name roland-radar
```

### Andere kostenlose Optionen

- **Vercel**: "Import Git Repository" → Framework: Vite. Zero-Config.
- **Netlify**: Drag-and-Drop `dist/` oder Git-Verbindung. Build: `npm run build`, Publish: `dist`.
- **GitHub Pages**: `vite build` + `dist/` in Branch `gh-pages` deployen.

## Connects / Account-Integrationen (später, optional)

| Dienst                         | Wofür                              | Kostenlos-Tier           |
| ------------------------------ | ---------------------------------- | ------------------------ |
| Cloudflare Pages               | Hosting + CI                       | ✅ unbegrenzt            |
| Cloudflare R2                  | Bilder-Uploads (ersetzt DataURL)   | ✅ 10 GB/Monat           |
| Cloudflare D1                  | SQL-DB (geteilte Routen, Community)| ✅ großzügig             |
| Cloudflare Workers             | API-Endpunkte (Upload, Auth)       | ✅ 100k req/Tag          |
| Cloudflare KV                  | einfache Key-Value-Daten           | ✅ gratis                |
| Supabase                       | Auth + Postgres + Storage          | ✅ 500 MB DB, 1 GB Files |
| Firebase                       | Auth + Firestore + Storage         | ✅ Spark-Plan            |
| MapTiler / MapLibre            | eigene Karte (optional)            | ✅ bis 100k Tiles/Monat  |

Für MVP **nicht notwendig** — alles läuft mit localStorage.
Sobald mehrere Nutzer Routen teilen sollen → Cloudflare Pages + D1 + R2 ist der günstigste Pfad.

## Roadmap (nach MVP)

- [ ] Routen teilen (Backend)
- [ ] Offline-Map-Kachel per MapLibre
- [ ] Wetter-Widget für Startort
- [ ] Reminder / Local Notifications (PWA Push)
- [ ] Export/Import der Daten als JSON

## Regeln

- einfach halten
- keine Diagnose — nur Hinweise
- keine Features erfinden, die nicht gebraucht werden
