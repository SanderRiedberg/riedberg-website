# Vattenlinjen - designspec för riedberg.se Fable 5-version

Datum: 2026-06-10
Status: Godkänd av Sander (koncept, språk och publika fakta bekräftade i session)

## Koncept

Sajten är en ö i Stockholms skärgård. Ovanför vattenlinjen: en polerad,
lugn personlig hemsida. Men sajten vet att den är en hemsida, och under
vattenlinjen bor dess medvetande. Besökaren kan dyka.

Dubbel personlighet:

- **Ytan (Mode A)** - fasaden. Elegant, indexerbar, professionell.
  Diskreta sprickor antyder att något lever därunder.
- **Djupet (Mode B)** - medvetandet. Sajtens inre monolog, dess
  tillblivelsehistoria, dess källkod, dess osminkade bild av Sander,
  och dess observationer av besöket.

Ton: torr humor + värme. Aldrig på bekostnad av innehållet.

## Beslut tagna med Sander

| Fråga | Beslut |
|---|---|
| Koncept | Vattenlinjen |
| Estetik | Bort från beige AI-minimalism. Skärgårdspalett: granit, havsglas, horisontljus |
| Self-awareness | Skriptat medvetande, inga API-anrop, ingen LLM i browsern |
| Språk | Engelska + flerspråkiga glimtar (svenska/tyska/finska) i den inre rösten |
| Pappa-rollen | Får nämnas, lågmält, inga namn eller detaljer |
| KFUM | Får nämnas inkl. vice ordförande för riksorganisationen |
| Familjebakgrund | Får nämnas: tysk-estnisk pappa, finsk mamma, Finland/Belgien, Spanien via fruns familj |
| Skärgårdsgården | Namnges INTE. Beskrivs som "an island camp in the Stockholm archipelago" eller liknande |

## Innehållskälla (braindump-sammanfattning)

- Kärna: göra världen bättre, bidra till något gott - därför medtech.
- Regulatory quality som intellektuell njutning: flerdimensionella
  problem, inga givna svar, väga saker fram och tillbaka.
- Älskar teknik, design, att saker är vackra.
- Havet, båtar, det marina. Skärgården formativ (gård, värderingar,
  natur, "olika bakgrund men alla människor").
- Europeisk identitet: bott i Finland och Belgien, mycket i Spanien.
- Nacka, hus, trädgård. 3D-skrivare. Fotograferade i tonåren.
- KFUM Sverige, vice ordförande riksorganisationen en mandatperiod.
- Vill uppfattas som: vis, analytisk, kunskapstung, strategisk -
  men elegant och trevlig.

## Mode A - Ytan

### Estetik

- Palett: granitgrå, havsglas-grönblå, horisontljus, varma solaccenter.
  Definieras som CSS-variabler + Tailwind-tokens (ersätter japandi-*).
- Tidsmedvetet ljus: himlens gradient och ljuston följer besökarens
  klocka i fyra lägen: dawn (05-08), day (08-17), golden (17-21),
  night (21-05). Implementeras som tema-klass på root + CSS-variabler.
  Första diskreta tecknet på att sajten är vaken.
- Typografi: elegant serif för rubriker/accent, sans för brödtext.
  Systemfonter eller en (1) variabel font, ingen font-tung lösning.

### Struktur och innehåll

1. **Hero** - fullhöjd med horisontkänsla. Namn, "Technology &
   Regulatory Quality", en kort positioneringsrad. Kontaktlänkar
   (email, telefon, blogg, LinkedIn - samma som idag).
2. **About** - bron mellan regulatory och tech. Flerdimensionella
   problem utan givna svar som drivkraft. Europeisk bakgrund.
   Baserad i Nacka, Stockholm.
3. **What I stand for** - göra världen bättre via medtech, skönhet
   som egenvärde, alla människor lika (KFUM-arvet), pappa-raden
   lågmält.
4. **Projects** - Midnight Pigeon + Gatlykta (återinsätts, tappades
   vid source-refaktorn) + länk till bloggen.
5. **Vattenlinjen** - sidans botten: levande vattenyta (canvas) med
   inbjudan att dyka. Knapp, tangentbordsnåbar.

### Sprickor i fasaden

- En statusrad (fast, diskret placerad) som ibland "märker" saker:
  rotation av korta observationer från röstmotorn (om tid på dygnet,
  återbesök, läsbeteende). Lågmäld frekvens, störande aldrig.
- Footerraden utvecklas från "Yes, of course AI built this homepage"
  till något i samma anda som pekar mot djupet.

## Dyket - övergången

- Trigger: knapp vid vattenlinjen, eller skroll förbi sidans botten.
- Animation: vattenytan stiger över viewporten, ljuset bryts, färger
  djupnar. Mål: en genomarbetad signaturövergång, inte en sidladdning.
- `prefers-reduced-motion`: omedelbar crossfade utan rörelse.
- URL-hash `#below` sätts i djupläget så att bakåtknapp och delbar
  länk fungerar. Direktbesök på `#below` öppnar djupet direkt.
- Fokus flyttas korrekt (a11y), Escape eller "surface"-knapp tar en upp.

## Mode B - Djupet

### Estetik

- Djupvatten: mörka blågröna toner, marint snöfall (partiklar),
  kaustiska ljusmönster. INTE terminal-grönt.
- Den inre rösten i monospace. Övrigt innehåll i samma typografi
  som ytan för igenkänning.

### Innehåll

1. **Inre monolog** - tankeström från röstmotorn. Reagerar på: tid på
   dygnet, veckodag, besöksräknare, läsbeteende (snabbskrollare vs
   läsare), idle-tid, viewport, prefers-color-scheme, antal dyk.
   Mest engelska; enstaka tankar "drömmer" på svenska, tyska eller
   finska med en engelsk parentes efteråt.
2. **The launch (Sjösättningen)** - sann berättelse om tillblivelsen:
   byggd av Claude (Fable 5) 2026-06-10 på uppdrag av Sander, riktiga
   designbeslut, riktiga commit-rubriker, självironiskt berättat.
3. **Source reading** - sajten visar fragment av sin faktiska källkod
   (Vite `?raw`-import av utvalda filer) och kommenterar dem.
4. **About Sander, unvarnished** - porträttet ur sajtens perspektiv,
   varmare och råare än fasaden: drivkrafterna, skärgårdsgården
   (utan namn), KFUM, det europeiska, en varm pappa-rad.
5. **Observations** - vad sajten vet om just detta besök, transparent
   listat, med integritet som charm: "Everything I know about you
   stays in your browser. I have no server to gossip to." (Sant:
   noll tracking, noll API-anrop, localStorage enda minnet.)

## Teknisk design

### Stack

Oförändrad: React 19, Vite 6, TypeScript, Tailwind 3. Nya
devDependencies: vitest (+ @testing-library/react vid behov, helst
inte). Inga nya runtime-beroenden utöver befintliga (lucide-react
behålls). Effekter handrullas i canvas 2D.

### Arkitektur (många små filer, < ~200 rader per fil)

```
src/
  App.tsx                  # mode-state (surface/below), dyk-orkestrering
  main.tsx
  index.css                # tokens, tidsteman, basstil
  surface/
    Hero.tsx
    About.tsx
    Values.tsx
    Projects.tsx
    FacadeCracks.tsx       # statusraden
    Waterline.tsx          # vattenytan + dykknapp
  depths/
    Depths.tsx             # layout för djupet
    Monologue.tsx
    Launch.tsx
    SourceReader.tsx
    Portrait.tsx
    Observations.tsx
  sea/
    waterSurface.ts        # canvasmotor: ytan (sinuslager, glitter)
    depthsBackdrop.ts      # canvasmotor: marint snö + kaustik
    SeaCanvas.tsx          # tunn React-wrapper för båda motorerna
  voice/
    types.ts               # Thought, VoiceContext
    engine.ts              # ren funktion: (thoughts, context, seen) -> urval
    thoughts.ts            # innehållet: all tankebank
    context.ts             # bygger VoiceContext från sensorer
  hooks/
    useTimeOfDay.ts
    useIdle.ts
    useScrollBehavior.ts
    useReducedMotion.ts
    useVisitMemory.ts
  state/
    visitMemory.ts         # versionerat localStorage-schema, säker parse
  theme/
    timeTheme.ts           # klocka -> temaläge
```

Befintliga `src/components/` (ParticleCanvas, ProfileCard) utgår och
ersätts av ovanstående. `types.ts` i root migreras in i respektive
modul.

### Principer

- Immutabilitet: visitMemory och voice-engine arbetar på kopior,
  aldrig mutation.
- Validering vid systemgräns: allt som läses från localStorage
  schema-valideras med säker fallback (korrupt data = börja om,
  aldrig krasch).
- Felhantering: canvas-motorer och localStorage får aldrig fälla
  sidan; try/catch med degradering till statisk bakgrund.
- Röstmotorn är en ren funktion: deterministisk givet (tankebank,
  kontext, sett-lista, seed) - därmed enkelt testbar.

### Prestanda

- Canvas: FPS-cap 30, pausas via visibilitychange, lägre partikel-
  täthet på mobil, devicePixelRatio-cap 2.
- Djupet code-splittas (dynamic import) så fasaden laddar snabbt.
- Budget: < 150 kB gzippat JS för fasaden.

### Tillgänglighet

- `prefers-reduced-motion`: statiska gradienter, ingen dykanimation,
  inga partiklar.
- Dykknapp och surface-knapp: riktiga knappar, fokushantering, Escape.
- Dekorativa canvas: `aria-hidden="true"`.
- Kontrast AA i båda lägena. Semantiska rubriknivåer. `lang="en"`.

### SEO

- Fasaden förblir fullt indexerbar (allt innehåll i DOM vid load).
- `index.html`: uppdaterad meta description + og:description som
  speglar nya innehållet. JSON-LD behålls och utökas måttligt
  (knowsAbout e.d. vid behov). OG-bild behålls som den är.
- `noscript`-blocket behålls. CNAME, .nojekyll, robots, sitemap rörs ej.

## Test och verifiering

- **Vitest** (nytt): enhetstester för `voice/engine`, `state/visitMemory`,
  `theme/timeTheme`, `voice/context`. Mål: 80 %+ på ren logik.
  UI/canvas verifieras visuellt, inte enhetstestas.
- `npm run build` utan fel eller varningar som blockerar.
- `npm run preview`: manuell + skärmdumpsverifiering, desktop- och
  mobilviewport, båda lägena, reduced motion på/av.
- Code-review-pass (code-reviewer-agent) innan push.
- Deploy: push till main, `gh run watch`, verifiera www.riedberg.se.

## Utanför scope (YAGNI)

- Ingen backend, ingen analytics, ingen riktig LLM, inget ljud.
- Ingen ny OG-bild, ingen bloggintegration, inget i18n-ramverk.
- Ingen ändring av DNS, workflow eller Pages-konfiguration.

## Leverabler utöver koden

- README.md och AGENTS.md uppdateras till nya arkitekturen.
- Denna spec + implementationsplan committas i docs/superpowers/.
