# riedberg-website

Källkoden för [www.riedberg.se](https://www.riedberg.se) - Sanders
personliga hemsida. React + Vite + TypeScript + Tailwind.

Konceptet heter **Vattenlinjen**: sajten är en ö i skärgården. Ovanför
vattenytan en polerad personlig fasad; under vattenlinjen bor sajtens
medvetande - en skriptad inre monolog, dess tillblivelsehistoria, dess
egen källkod och allt den vet om besöket. Besöksminnet stannar i
besökarens webbläsare; besök räknas anonymt och cookiefritt i
self-hostad Umami på egen server - inga tredje parter någonstans.
Spec och plan: [`docs/superpowers/`](./docs/superpowers/).

## Lokal utveckling

```bash
npm install
npm run dev       # dev-server på localhost:5173
npm test          # vitest - röstmotor, minne, tidstema
npm run typecheck # TypeScript utan output
npm run build     # bygger till dist/
npm run preview   # serverar dist/ lokalt för verifiering
```

Dolda utvecklarparametrar: `?t=dawn|day|golden|night` låser tidsljuset,
`?y=2400` skrollar dit efter mount (för headless-skärmdumpar).

## Arkitektur

| Plats | Vad |
|---|---|
| `src/surface/` | Fasaden: Hero, About, In practice, Projects, Waterline, FacadeCracks, DiveTransition |
| `src/depths/` | Medvetandet: Monologue, Portrait, Launch, SourceReader, Observations |
| `src/voice/` | Röstmotorn: tankebank (`thoughts.ts`), urvalslogik (`engine.ts`), kontext |
| `src/sea/` | Canvasmotorer: vattenyta, djupbakgrund, delat chassi |
| `src/hooks/` | Sensorer: tid på dygnet, idle, skrollbeteende, mediapreferenser, besöksminne |
| `src/state/` | `visitMemory.ts` - versionerat localStorage-minne, validerat vid läsning |
| `src/theme/` | Klocka → tidstema |
| `tests/` | Vitest-enhetstester för all ren logik |
| `scripts/` | Verifieringsharness (Playwright; sätt `CHROME_PATH` om Chromium inte hittas automatiskt) |
| `public/` | Statiska filer: CNAME, favicon, OG-bild, robots, sitemap |
| `.github/workflows/deploy.yml` | Auto-build + deploy till Pages |

## Deploy

`git push origin main` → GitHub Action bygger och deployar till Pages.
Inget manuellt steg. ~60 sek från push till live.

GitHub Pages source är konfigurerad som **GitHub Actions**
(Settings → Pages). Inte "Deploy from a branch".

Custom domain följer med bygget via `public/CNAME`.

Se [`AGENTS.md`](./AGENTS.md) för agent-specifika instruktioner.
