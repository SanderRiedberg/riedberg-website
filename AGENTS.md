# Agent instructions

Snabba fakta för en AI-agent (Claude Code, Codex, Cursor) som
ska jobba i det här repot. Spara tool-calls - läs detta först.

## Vad det här är

`www.riedberg.se` - Sanders personliga hemsida, konceptet
**Vattenlinjen**: en polerad fasad ovanför vattenytan och ett
skriptat "medvetande" under den (`#below`). React + Vite 6 +
TypeScript + Tailwind 3 + vitest. Byggs och deployas via GitHub
Actions, hostas på GitHub Pages med custom domain via Loopia DNS.
Designspec och implementationsplan ligger i `docs/superpowers/`.

## Hårda principer

- **Inga tredje parter.** Lägg ALDRIG till externa fonter (CDN),
  tredjeparts-analytics eller andra tredjepartsanrop. Fonten är
  självhostad via `@fontsource-variable/fraunces`. ENDA sanktionerade
  telemetrin: self-hostad Umami på Sanders egen server
  (analytics.riedberg.se, beacon i `index.html`) - cookiefri och
  anonym. Sajtens integritetstext (Observations + Waterline + llms.txt)
  beskriver exakt detta; ändras verkligheten MÅSTE texten ändras med.
- **Immutabilitet och validering.** `visitMemory` läses alltid via
  säker parse med fallback; uppdateringar är immutabla. Behåll det.
- **Reduced motion respekteras överallt** - canvasmotorer ritar en
  statisk frame, dyket blir en crossfade.
- Bygg inte lokalt för att deploya. `git push` triggar Action.
- Rör inte `dist/`, `public/CNAME`-upplägget eller Pages-source.

## Vad du gör vid typiska ändringar

- **Sajtens "tankar"** → `src/voice/thoughts.ts`. Unika `id`
  (persisteras som sedda), `when`-villkor mot `VoiceContext`,
  `once` för engångstankar. Kör `npm test` efteråt.
- **Fasadens text** → `src/surface/About.tsx`, `Values.tsx`,
  `Projects.tsx`, `Hero.tsx`.
- **Djupets text** → `src/depths/Portrait.tsx`, `Launch.tsx`,
  `Observations.tsx`.
- **Färger / tidsljus** → `tailwind.config.js` (tokens) och
  `src/index.css` (`[data-time=...]`-variabler).
- **Canvaseffekter** → `src/sea/`. FPS-cap och visibilitets-paus
  ligger i `src/sea/engine.ts`.
- **SEO** → `index.html` (meta, og, JSON-LD), `public/sitemap.xml`.

## Verifiering före push

```bash
npm ci
npm test                 # 37+ enhetstester ska vara gröna
npm run build            # utan errors
npm run preview          # localhost:4173
node scripts/shoot.mjs "http://localhost:4173/?t=day" /tmp/shot   # skärmdump + layoutmetrik
node scripts/dive-test.mjs                                        # dyk/escape/back-flöde
```

Skärmdumpsskripten använder den lokalt cachade Playwright-chromium
(`~/Library/Caches/ms-playwright/chromium_headless_shell-1223`).
Dolda dev-parametrar: `?t=dawn|day|golden|night` låser tidstemat,
`?y=<px>` skrollar efter mount.

Snabbcheck efter push: `gh run watch` eller Actions-fliken.

## DNS-läge (status quo, ändra bara om det krävs)

| Record | Värde |
|---|---|
| `www.riedberg.se` CNAME | `sanderriedberg.github.io.` |
| `riedberg.se` apex A × 4 | `185.199.108-111.153` |
| `_dmarc` TXT | `v=DMARC1; p=none; rua=mailto:sander@riedberg.se` |
| `sig1._domainkey` CNAME | iCloud-mail DKIM |
| Övriga subdomäner | CNAME mot `riedberg.duckdns.org.` (hemma-server) |

DNS-leverantör: Loopia. Mail: iCloud Custom Domain.

## Var bor det andra?

- `gatlykta.riedberg.se` - annat repo (`SanderRiedberg/gatlykta`).
- Hemma-server (Ubuntu, `ssh ubuntu-server`) hostar `books`, `home`,
  `blog`, `ai`, `vpn` via Nginx Proxy Manager.

## Workflow för en uppdatering

```bash
git clone https://github.com/SanderRiedberg/riedberg-website
cd riedberg-website && npm install
# editera, t.ex. src/voice/thoughts.ts
npm test && npm run build
git add -A && git commit -m "feat: ny tanke i tankebanken"
git push   # ~60 sek senare live
```

- **Räknegubben** → `src/depths/CountingHouse.tsx` + `ClerkScene.tsx` + `Odometer.tsx`. Data: `src/lib/umamiShare.ts` - sätt `SHARE_ID` (från Umamis share-URL) för att aktivera; tom sträng = off duty-läge. Read-only via publik share-token, CORS redan öppet i Umami.
