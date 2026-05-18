# Agent instructions

Snabba fakta för en AI-agent (Claude Code, Codex, Cursor) som
ska jobba i det här repot. Spara tool-calls — läs detta först.

## Vad det här är

`www.riedberg.se` — en singel-sida personlig landning. React +
Vite 6 + TypeScript + Tailwind 3. Byggs och deployas via GitHub
Actions, hostas på GitHub Pages med custom domain via Loopia DNS.

## Vad du INTE behöver göra

- **Bygg inte lokalt** för att deploya. `git push` triggar Action
  som bygger och publicerar. Lokala `npm run build` används bara
  om du vill verifiera output innan push.
- **Rör inte `dist/`** — den är `.gitignored` och regenereras av
  Action vid varje push.
- **Skapa inte ny `CNAME`-fil i root.** Den ligger i `public/`
  och Vite kopierar den till `dist/CNAME` vid build. Två CNAME-
  filer på olika ställen ställer till det.
- **Rör inte Pages-source via Settings**. Den är satt till
  "GitHub Actions" och styrs av `.github/workflows/deploy.yml`.

## Vad du gör vid typiska ändringar

- **Texten på sidan** → editera `src/components/ProfileCard.tsx`
  eller den komponent som äger texten. Pusha. Klart.
- **Färger / typografi** → `src/index.css` eller `tailwind.config.js`.
- **Favicon** → `public/favicon.svg`. Single SVG täcker alla
  storlekar via tre `<link>`-taggar i `index.html`.
- **SEO** → `index.html` (meta, og:, JSON-LD) och
  `public/sitemap.xml`, `public/robots.txt`.
- **Nytt repo-bundlat asset** → lägg i `public/` om det ska
  serveras as-is, eller importera i source om Vite ska bundla.

## Verifiering före push

```bash
npm ci          # rensar och installerar exakt enligt lock-fil
npm run build   # ska gå utan errors; output i dist/
npm run preview # öppna localhost:4173, kolla sajten
```

Snabbcheck efter push:

```bash
gh run watch    # följ Action-statusen från terminalen
```

eller besök Actions-fliken i repot.

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

- `gatlykta.riedberg.se` — annat repo (`SanderRiedberg/gatlykta`)
  med en mer omfattande `WORKLOG.md` och `ARCHITECTURE.md`.
- Hemma-server (Ubuntu, nås via `ssh ubuntu-server` från Sanders
  Mac) hostar `books`, `home`, `blog`, `ai`, `vpn` via Nginx
  Proxy Manager. Tidigare host av `www.riedberg.se`, nu inaktiv
  proxy_host/7.conf — kan rensas vid lugnt tillfälle.

## Workflow för en uppdatering

```bash
git clone https://github.com/SanderRiedberg/riedberg-website
cd riedberg-website
npm install
# editera vad du vill, t.ex. src/components/ProfileCard.tsx
npm run dev          # iterera på localhost:5173
git add -A
git commit -m "feat: ny rad på profilkortet"
git push
# ~60 sek senare live på www.riedberg.se
```

Klart. Inga fler steg.
