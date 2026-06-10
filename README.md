# riedberg-website

Källkoden för [www.riedberg.se](https://www.riedberg.se) - Sanders
personliga hemsida. React + Vite + TypeScript + Tailwind.

Konceptet heter **Vattenlinjen**: sajten är en ö i skärgården. Ovanför
vattenytan en polerad personlig fasad; under vattenlinjen bor sajtens
medvetande - en skriptad inre monolog, dess tillblivelsehistoria, dess
egen källkod och allt den vet om besöket (vilket stannar i besökarens
webbläsare; det finns ingen server, ingen tracking, inga API-anrop).
Spec och plan: [`docs/superpowers/`](./docs/superpowers/).

## Lokal utveckling

```bash
npm install
npm run dev       # dev-server på localhost:5173
npm test          # vitest - röstmotor, minne, tidstema
npm run build     # bygger till dist/
npm run preview   # serverar dist/ lokalt för verifiering
```

Dolda utvecklarparametrar: `?t=dawn|day|golden|night` låser tidsljuset,
`?y=2400` skrollar dit efter mount (för headless-skärmdumpar).

## Arkitektur

| Plats | Vad |
|---|---|
| `src/surface/` | Fasaden: Hero, About, Values, Projects, Waterline, FacadeCracks, DiveTransition |
| `src/depths/` | Medvetandet: Monologue, Portrait, Launch, SourceReader, Observations |
| `src/voice/` | Röstmotorn: tankebank (`thoughts.ts`), urvalslogik (`engine.ts`), kontext |
| `src/sea/` | Canvasmotorer: vattenyta, djupbakgrund, delat chassi |
| `src/hooks/` | Sensorer: tid på dygnet, idle, skrollbeteende, mediapreferenser, besöksminne |
| `src/state/` | `visitMemory.ts` - versionerat localStorage-minne, validerat vid läsning |
| `src/theme/` | Klocka → tidstema |
| `tests/` | Vitest-enhetstester för all ren logik |
| `scripts/` | Verifieringsharness (Playwright-skärmdumpar via cachad chromium) |
| `public/` | Statiska filer: CNAME, favicon, OG-bild, robots, sitemap |
| `.github/workflows/deploy.yml` | Auto-build + deploy till Pages |

## Deploy

`git push origin main` → GitHub Action bygger och deployar till Pages.
Inget manuellt steg. ~60 sek från push till live.

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
