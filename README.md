# riedberg-website

Källkoden för [www.riedberg.se](https://www.riedberg.se) — Sanders
personliga landningssida. React + Vite + TypeScript + Tailwind.

## Lokal utveckling

```bash
npm install
npm run dev       # dev-server på localhost:5173
npm run build     # bygger till dist/
npm run preview   # serverar dist/ lokalt för verifiering
```

## Arkitektur

| Plats | Vad |
|---|---|
| `src/` | React-källkod (App, components, styles) |
| `index.html` | Vite-entry, refererar `/src/main.tsx` |
| `public/` | Statiska filer som kopieras as-is till `dist/` |
| `public/CNAME` | `www.riedberg.se` — håller GitHub Pages custom domain |
| `public/favicon.svg` | Monogram-favicon (en enda SVG, alla sizes) |
| `public/og-1200x630.jpg` | Open Graph-bild |
| `public/robots.txt`, `sitemap.xml`, `ld.html` | SEO-statics |
| `.github/workflows/deploy.yml` | Auto-build + deploy till Pages |
| `dist/` | Build-output (gitignored, byggs av Action) |

## Deploy

`git push origin main` → GitHub Action bygger automatiskt och
deployar till Pages. Inget manuellt steg. ~60 sek från push till
live.

GitHub Pages source är konfigurerad som **GitHub Actions**
(Settings → Pages). Inte "Deploy from a branch".

## Custom domain

Driven av `public/CNAME` som Vite kopierar oförändrad till
`dist/CNAME`. DNS hanteras på Loopia:

- `www` CNAME → `sanderriedberg.github.io.`
- Apex `@` A-records → `185.199.108-111.153` (Pages-IPs, ger
  redirect `riedberg.se` → `https://www.riedberg.se`)

## Övriga subdomäner (utanför detta repo)

- `gatlykta.riedberg.se` → eget repo `gatlykta` på GitHub Pages
- `books`, `home`, `blog`, `ai`, `vpn` → CNAME mot
  `riedberg.duckdns.org.` (Ubuntu-server hemma)

Se [`AGENTS.md`](./AGENTS.md) för agent-specifika instruktioner.
