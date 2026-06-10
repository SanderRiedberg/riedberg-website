# Vattenlinjen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Avvikelse från plan-mallen (medveten, budgetstyrd):** Planen exekveras
> inline av samma session som skrev den, direkt efter committen. Därför
> specificeras logikmoduler med fullständiga typer och testkod, medan
> komponent-JSX och copy specificeras via spec + tokens + innehållsutkast
> i stället för verbatim kod. Spec: `../specs/2026-06-10-vattenlinjen-design.md`.

**Goal:** Bygg om riedberg.se till Vattenlinjen: en skärgårdsljus fasad med ett dykbart undervattensmedvetande, statiskt på GitHub Pages.

**Architecture:** React 19 + Vite 6 + Tailwind 3, inga nya runtime-beroenden. Ren TypeScript-logik (röstmotor, besöksminne, tidstema) separerad från React-skal och handrullade canvas-motorer. Djupet code-splittas.

**Tech Stack:** React 19, Vite 6, TypeScript 5.8, Tailwind 3.4, vitest (nytt, dev), lucide-react (befintlig).

---

## Palett och tokens (låses här)

Tailwind-färger (ersätter `japandi-*`):

```js
// tailwind.config.js theme.extend.colors
mist:     '#ECF1F4',  // ljus dis/bakgrund
horizon:  '#C9D8DE',  // blek horisont
seaglass: '#6FA29A',  // havsglas, primär accent
granite:  '#4A555E',  // brödtext
ink:      '#1F262B',  // rubriker
sun:      '#E0A458',  // varm solaccent
foam:     '#FDFEFE',  // kort/yta
abyss:    '#07131A',  // djupets botten
deep:     '#0C2230',  // djupets paneler
current:  '#14394C',  // djupets mellanton
biolume:  '#5FD3BC',  // självlysande accent (rösten)
moon:     '#BFD6DD',  // ljus text under ytan
```

Tidsteman som CSS-variabler på `:root[data-time="..."]` (styr hero-himlens
gradient + accentton + hero-textfärg): `dawn`, `day`, `golden`, `night`.
Natt och gryning ger mörkare himmel med ljus herotext (`--hero-ink`).
Typografi: systemfonter. Serif för rubriker ("Iowan Old Style", Palatino,
Georgia, serif), system-sans för brödtext. Ingen webfont.

## Delade typer (låses här)

```ts
// src/voice/types.ts
export type TimeOfDay = 'dawn' | 'day' | 'golden' | 'night';
export type SiteMode = 'surface' | 'below';
export type ReadingStyle = 'reader' | 'scanner' | 'unknown';

export interface VoiceContext {
  timeOfDay: TimeOfDay;
  weekday: number;            // 0 = söndag
  visitCount: number;         // 1 = första besöket
  divesCount: number;
  isReturning: boolean;
  readingStyle: ReadingStyle;
  idleSeconds: number;
  viewport: 'mobile' | 'desktop';
  prefersDark: boolean;
  reducedMotion: boolean;
  mode: SiteMode;
}

export interface Thought {
  id: string;                          // unik, stabil (persisteras i seen)
  text: string;
  when?: (ctx: VoiceContext) => boolean;
  weight?: number;                     // default 1
  once?: boolean;                      // max en gång per webbläsare
}
```

```ts
// src/state/visitMemory.ts
export interface VisitMemory {
  version: 1;
  firstVisitIso: string;
  visitCount: number;
  divesCount: number;
  thoughtsSeen: readonly string[];
}
// API (alla rena, immutabla):
// loadMemory(storage: Pick<Storage,'getItem'>, nowIso: string): VisitMemory
// recordVisit(m: VisitMemory): VisitMemory
// recordDive(m: VisitMemory): VisitMemory
// markSeen(m: VisitMemory, ids: readonly string[]): VisitMemory  // dedupe
// saveMemory(storage: Pick<Storage,'setItem'>, m: VisitMemory): void  // sväljer quota-fel
// STORAGE_KEY = 'riedberg.visitMemory.v1'
```

```ts
// src/voice/engine.ts
export interface PickResult {
  thought: Thought | null;
  seen: readonly string[];   // ny lista, aldrig muterad input
}
// pickThought(
//   thoughts: readonly Thought[],
//   ctx: VoiceContext,
//   seen: readonly string[],
//   random: () => number      // injicerbar för determinism i test
// ): PickResult
// Urval: filtrera på when(ctx) || true; exkludera once-tankar i seen;
// föredra osedda (om alla kvalificerade är sedda: tillåt icke-once-repris);
// viktad slumpning med random(); null om inget kvalificerar.
```

```ts
// src/theme/timeTheme.ts
// timeOfDayFor(hour: number): TimeOfDay
// dawn: 5-7, day: 8-16, golden: 17-20, night: 21-4 (hela timmar)
```

```ts
// src/sea/waterSurface.ts och src/sea/depthsBackdrop.ts
export interface CanvasEngine { start(): void; stop(): void; destroy(): void; }
// createWaterSurface(canvas, opts: { reduced: boolean }): CanvasEngine
// createDepthsBackdrop(canvas, opts: { reduced: boolean }): CanvasEngine
// Båda: FPS-cap 30, pause via document.visibilitychange, dpr-cap 2,
// lägre täthet < 768 px, try/catch i frame-loop -> stop() vid fel.
// reduced: true -> ritar en statisk frame och startar ingen loop.
```

## Filkarta

```
Skapas:  src/theme/timeTheme.ts, src/state/visitMemory.ts,
         src/voice/{types,engine,context,thoughts}.ts,
         src/hooks/{useTimeOfDay,useReducedMotion,useVisitMemory,useIdle,useScrollBehavior}.ts,
         src/sea/{waterSurface,depthsBackdrop}.ts, src/sea/SeaCanvas.tsx,
         src/surface/{Hero,About,Values,Projects,Waterline,FacadeCracks}.tsx,
         src/depths/{Depths,Monologue,Launch,SourceReader,Portrait,Observations}.tsx,
         tests/ (vitest, speglar src/)
Ändras:  src/App.tsx, src/index.css, tailwind.config.js, index.html,
         package.json (vitest + test-script), README.md, AGENTS.md
Tas bort: src/components/ParticleCanvas.tsx, src/components/ProfileCard.tsx,
         types.ts (root)
```

---

### Task 1: Vitest + tidstema (TDD)

**Files:** Create `src/theme/timeTheme.ts`, `tests/timeTheme.test.ts`. Modify `package.json`, `vite.config.ts`.

- [ ] `npm install -D vitest`; lägg till script `"test": "vitest run"`.
- [ ] Skriv failande test:

```ts
import { describe, it, expect } from 'vitest';
import { timeOfDayFor } from '../src/theme/timeTheme';

describe('timeOfDayFor', () => {
  it.each([
    [4, 'night'], [5, 'dawn'], [7, 'dawn'], [8, 'day'], [16, 'day'],
    [17, 'golden'], [20, 'golden'], [21, 'night'], [0, 'night'],
  ] as const)('hour %i -> %s', (hour, expected) => {
    expect(timeOfDayFor(hour)).toBe(expected);
  });
  it('kastar inte på ogiltiga timmar utan klampar till night', () => {
    expect(timeOfDayFor(-1)).toBe('night');
    expect(timeOfDayFor(99)).toBe('night');
  });
});
```

- [ ] Kör `npx vitest run` - FAIL (modul saknas). Implementera minimalt. PASS.
- [ ] Commit: `feat: add vitest and time-of-day theme logic`

### Task 2: visitMemory (TDD)

**Files:** Create `src/state/visitMemory.ts`, `tests/visitMemory.test.ts`.

- [ ] Failande tester:

```ts
import { describe, it, expect } from 'vitest';
import {
  loadMemory, recordVisit, recordDive, markSeen, saveMemory, STORAGE_KEY,
} from '../src/state/visitMemory';

const NOW = '2026-06-10T20:00:00.000Z';
const fakeGet = (value: string | null) => ({ getItem: () => value });

describe('loadMemory', () => {
  it('ger färskt minne när storage är tomt', () => {
    const m = loadMemory(fakeGet(null), NOW);
    expect(m).toEqual({
      version: 1, firstVisitIso: NOW, visitCount: 0,
      divesCount: 0, thoughtsSeen: [],
    });
  });
  it('ger färskt minne vid korrupt JSON och vid fel version', () => {
    expect(loadMemory(fakeGet('{nope'), NOW).visitCount).toBe(0);
    expect(loadMemory(fakeGet('{"version":99}'), NOW).visitCount).toBe(0);
  });
  it('ger färskt minne om getItem kastar', () => {
    const throwing = { getItem: () => { throw new Error('blocked'); } };
    expect(loadMemory(throwing, NOW).visitCount).toBe(0);
  });
});

describe('uppdateringar är immutabla', () => {
  it('recordVisit ökar räknaren utan att mutera', () => {
    const m = loadMemory(fakeGet(null), NOW);
    const m2 = recordVisit(m);
    expect(m2.visitCount).toBe(1);
    expect(m.visitCount).toBe(0);
  });
  it('recordDive ökar divesCount', () => {
    expect(recordDive(loadMemory(fakeGet(null), NOW)).divesCount).toBe(1);
  });
  it('markSeen dedupar', () => {
    const m = markSeen(loadMemory(fakeGet(null), NOW), ['a', 'a', 'b']);
    expect([...m.thoughtsSeen].sort()).toEqual(['a', 'b']);
    expect(markSeen(m, ['a']).thoughtsSeen.length).toBe(2);
  });
});

describe('saveMemory', () => {
  it('sväljer setItem-fel (quota/privat läge)', () => {
    const throwing = { setItem: () => { throw new Error('quota'); } };
    expect(() => saveMemory(throwing, loadMemory(fakeGet(null), NOW))).not.toThrow();
  });
});
```

- [ ] FAIL -> implementera -> PASS -> Commit: `feat: add versioned, validated visit memory`

### Task 3: Röstmotor (TDD)

**Files:** Create `src/voice/types.ts`, `src/voice/engine.ts`, `src/voice/context.ts`, `tests/engine.test.ts`, `tests/context.test.ts`.

- [ ] Failande tester (kärnan):

```ts
import { describe, it, expect } from 'vitest';
import { pickThought } from '../src/voice/engine';
import type { Thought, VoiceContext } from '../src/voice/types';

const ctx = (over: Partial<VoiceContext> = {}): VoiceContext => ({
  timeOfDay: 'day', weekday: 3, visitCount: 1, divesCount: 0,
  isReturning: false, readingStyle: 'unknown', idleSeconds: 0,
  viewport: 'desktop', prefersDark: false, reducedMotion: false,
  mode: 'surface', ...over,
});
const t = (id: string, over: Partial<Thought> = {}): Thought =>
  ({ id, text: id, ...over });

describe('pickThought', () => {
  it('filtrerar på when-villkor', () => {
    const thoughts = [
      t('night-only', { when: c => c.timeOfDay === 'night' }),
      t('always'),
    ];
    const r = pickThought(thoughts, ctx(), [], () => 0);
    expect(r.thought?.id).toBe('always');
  });
  it('visar aldrig once-tankar två gånger', () => {
    const thoughts = [t('one', { once: true }), t('two')];
    const r = pickThought(thoughts, ctx(), ['one'], () => 0);
    expect(r.thought?.id).toBe('two');
  });
  it('föredrar osedda framför sedda', () => {
    const thoughts = [t('seen'), t('fresh')];
    const r = pickThought(thoughts, ctx(), ['seen'], () => 0);
    expect(r.thought?.id).toBe('fresh');
  });
  it('tillåter repris av icke-once när allt är sett', () => {
    const r = pickThought([t('seen')], ctx(), ['seen'], () => 0);
    expect(r.thought?.id).toBe('seen');
  });
  it('returnerar null när inget kvalificerar', () => {
    const r = pickThought([t('x', { when: () => false })], ctx(), [], () => 0);
    expect(r.thought).toBeNull();
    expect(r.seen).toEqual([]);
  });
  it('viktad slumpning är deterministisk med injicerad random', () => {
    const thoughts = [t('light', { weight: 1 }), t('heavy', { weight: 9 })];
    expect(pickThought(thoughts, ctx(), [], () => 0.05).thought?.id).toBe('light');
    expect(pickThought(thoughts, ctx(), [], () => 0.5).thought?.id).toBe('heavy');
  });
  it('muterar inte seen-listan utan returnerar ny med valt id', () => {
    const seen: string[] = [];
    const r = pickThought([t('a')], ctx(), seen, () => 0);
    expect(seen).toEqual([]);
    expect(r.seen).toEqual(['a']);
  });
});
```

`context.ts`: ren `buildVoiceContext(deps)` som mappar primitiva indata
(hour, width, matchMedia-resultat, minne, mode, beteende) till
`VoiceContext`; testas med 2-3 fall (mobile-breakpoint 768, isReturning
= visitCount > 1).

- [ ] FAIL -> implementera -> PASS -> Commit: `feat: add scripted-consciousness voice engine`

### Task 4: Sensorhooks

**Files:** Create `src/hooks/*.ts` (5 st).

- [ ] Tunna wrappers, all logik bor i redan testade moduler:
  `useTimeOfDay` (klocka -> TimeOfDay, uppdaterar varje minut),
  `useReducedMotion`/`usePrefersDark` (matchMedia + listener; prefersDark
  läggs i samma fil som reduced motion-hooken),
  `useVisitMemory` (load + recordVisit en gång vid mount, exponerar
  `memory` + `dive()` + `noteSeen()`; sparar vid ändring),
  `useIdle(thresholdSeconds)` (pointer/key/scroll-events nollställer),
  `useScrollBehavior` (klassar reader/scanner/unknown via skrollhastighet
  över tid). Inga nya tester (ren DOM-lim).
- [ ] `npm run build` grönt. Commit: `feat: add sensor hooks`

### Task 5: Havsmotorer (canvas)

**Files:** Create `src/sea/waterSurface.ts`, `src/sea/depthsBackdrop.ts`, `src/sea/SeaCanvas.tsx`.

- [ ] `waterSurface`: 3 lager sinusvågor (olika amplitud/fas/hastighet,
  seaglass/horizon-toner med alfa), glitterprickar längs vågkammar vid
  `golden`/`day`. `depthsBackdrop`: marint snöfall (långsamt fallande
  partiklar, parallax i 2 lager) + svepande kaustikband (sin-moduler
  med låg alfa i biolume/current-toner).
- [ ] `SeaCanvas.tsx`: props `{ factory, reduced, className }`; äger
  canvas-ref, ResizeObserver, mount/unmount-livscykel, `aria-hidden`.
- [ ] Verifiera i `npm run dev` med temporär testyta. Commit:
  `feat: add water surface and depths canvas engines`

### Task 6: Ytan - fasadens komponenter

**Files:** Create `src/surface/*.tsx` (6 st). Modify `src/App.tsx`, `src/index.css`, `tailwind.config.js`.

- [ ] Tokens + tidstema-CSS in i `tailwind.config.js`/`index.css`;
  `data-time` sätts på `<html>` från `useTimeOfDay`.
- [ ] `Hero`: fullhöjd, tidsstyrd himmelsgradient, namn, titel, en
  positioneringsrad, kontaktlänkar (email/telefon/blogg/LinkedIn,
  samma värden som idag, lucide-ikoner).
- [ ] `About`, `Values`, `Projects` (Midnight Pigeon + Gatlykta + blogg)
  enligt spec-innehåll; copyutkast skrivs här, poleras i Task 9.
- [ ] `Waterline`: sektion längst ner med `SeaCanvas(waterSurface)` och
  dykknapp ("Dive below the waterline" e.l.).
- [ ] `FacadeCracks`: diskret statusrad (fast position) som via
  röstmotorn fadar in en surface-tanke ~var 60-90 s (första efter
  ~20 s), fadar ut efter ~8 s. Ingen live-region (medvetet: stör inte
  skärmläsare); vanlig text i DOM.
- [ ] `App.tsx` renderar Hero/About/Values/Projects/Waterline +
  FacadeCracks. Gamla komponenter bort ur trädet (filer tas bort i
  Task 10). `npm run build` grönt, visuell koll i dev.
- [ ] Commit: `feat: rebuild facade as archipelago surface`

### Task 7: Dyket - mode och övergång

**Files:** Modify `src/App.tsx`. Create dyk-overlay (i App eller `src/surface/DiveTransition.tsx`).

- [ ] Mode-state `surface | below` + transition-state. Dykknapp ->
  overlay (vattenyta stiger, CSS-transform ~1.2 s) -> mode `below`,
  `location.hash = '#below'`, fokus till djupets H1. Surfacing samma
  väg upp, hash rensas. `hashchange`/load med `#below` -> direkt djup.
  Escape under ytan -> upp. Reduced motion -> snabb crossfade.
- [ ] Overscroll vid sidbotten (ackumulerad wheel/touch-delta >
  tröskel) triggar också dyket; knappen är primär väg.
- [ ] Djupet code-splittas: `const Depths = React.lazy(...)`.
- [ ] Commit: `feat: add the dive transition between surface and depths`

### Task 8: Djupet - medvetandets komponenter

**Files:** Create `src/depths/*.tsx` (6 st).

- [ ] `Depths`: layout, `SeaCanvas(depthsBackdrop)`, surface-knapp,
  rubrik som tar emot fokus.
- [ ] `Monologue`: tankeström - var ~7 s väljs ny tanke ur banken
  (mode 'below'), skrivs ut med skrivmaskinskänsla (reduced motion:
  direkt), behåller de senaste ~6 synliga. `noteSeen` persisterar.
- [ ] `Observations`: lista över vad sajten vet (lokal tid, tema,
  besök nr, dyk, viewport, dark/reduced, referrer-närvaro, tid på
  sidan live, läsarstil) + integritetsraden från spec.
- [ ] `Portrait`: "About Sander, unvarnished" - ur sajtens perspektiv.
- [ ] `Launch`: tillblivelsen, riktiga commit-rubriker (hämta med
  `git log --oneline` vid skrivtillfället), Fable 5-historien.
- [ ] `SourceReader`: `?raw`-import av `voice/engine.ts` och
  `sea/waterSurface.ts`, visar utvalda utdrag med kommentarer.
- [ ] Commit: `feat: add the depths - monologue, observations, portrait, launch, source reader`

### Task 9: Innehållspass

**Files:** Modify `src/voice/thoughts.ts`, all copy, `index.html`.

- [ ] Tankebank ~50 tankar: tid på dygnet (4 lägen), veckodag (helg/
  vardag), första besök vs återbesök (trappa: 2:a, 3:e, många),
  reader/scanner, idle, mobil/desktop, dark mode, reprisskydd via
  `once` där det behövs. 5-6 tankar "drömmer" på svenska/tyska/finska
  med engelsk parentes. Ton: torr humor + värme, aldrig raljant.
- [ ] Footerrad (fasaden) som pekar mot djupet, arvtagare till "Yes,
  of course AI built this homepage".
- [ ] `index.html`: meta/og description uppdateras till nya innehållet;
  JSON-LD behålls (ev. `knowsAbout`); noscript intakt.
- [ ] Commit: `feat: full thought bank and content polish`

### Task 10: Städning + dokumentation

**Files:** Delete `src/components/`, `types.ts`. Modify `README.md`, `AGENTS.md`.

- [ ] Ta bort döda filer; flytta ev. kvarvarande typer till sina moduler.
- [ ] README/AGENTS: ny arkitektur, testkommando, oförändrad deploy.
- [ ] `npm run build` + `npx vitest run` gröna. Commit:
  `chore: remove legacy components, update docs`

### Task 11: Verifiering + granskning

- [ ] `npm ci && npm run build && npx vitest run` - allt grönt.
- [ ] `npm run preview` + skärmdumpar (Playwright om chromium finns
  billigt tillgängligt, annars strukturella curl-checkar + dev-koll):
  desktop + 390 px mobil, surface + depths, reduced motion, natt-tema
  (mocka klockan via dev-konsol eller temporär query-param `?t=night`
  som tas bort innan push - beslut: implementera `?t=` permanent som
  dold utvecklarfiness, den skadar inte och underlättar verifiering).
- [ ] code-reviewer-agent på diffen; åtgärda CRITICAL/HIGH.
- [ ] Commit fixar.

### Task 12: Deploy + livekontroll

- [ ] `git push origin main`; `gh run watch` tills grönt.
- [ ] `curl -s https://www.riedberg.se | grep` på nytt innehåll;
  besök för ögonkoll. Rapportera till Sander.

## Självgranskning (utförd)

- Spec-täckning: alla spec-sektioner mappar till Task 1-12 (estetik/
  tokens: T6; tidsljus: T1/T6; sprickor: T6; dyk: T7; djupets fem
  delar: T8; röstmotor: T3; sensorer: T4; minne: T2; canvas: T5;
  a11y/SEO: T6-T9; tester: T1-T3; docs: T10; deploy: T12).
- Typkonsistens: `pickThought`-signatur, `VisitMemory`-API och
  `CanvasEngine` definieras en gång ovan och återanvänds i tasks.
- Inga TBD/TODO kvar. `?t=`-frågan avgjord (permanent, dold).
