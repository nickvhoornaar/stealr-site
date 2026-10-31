# StealR-website (`site/`)

Statische site: plain HTML + CSS, één klein script voor de taalkeuze (EN/NL), geen framework, geen build-stap. Het enige externe is Google Fonts (Inter).

| Bestand | Wat |
|---|---|
| `index.html` | Landing (EN, NL via de schakelaar rechtsboven of `?lang=nl`) |
| `privacy.html` | Privacyverklaring EN + NL, ankers `#delete-account` en `#account-verwijderen` (voor de stores) |
| `support.html` | Contact en veelgestelde vragen |
| `404.html` | Niet-gevonden-pagina (GitHub Pages en Netlify pakken die automatisch op) |
| `css/site.css`, `js/lang.js` | Stijl en taalschakelaar |
| `img/` | Wordmark, logo, screenshots (600 px WebP), og-image 1200×630, iconen |
| `robots.txt`, `sitemap.xml` | Voor zoekmachines |

Bron van de teksten: `docs/release/store-teksten.md` en `docs/release/privacy-stealr.html`. Verander je daar iets, verander het hier ook.

## Lokaal bekijken

```bash
npx serve site
```

of `python -m http.server 8080 --directory site`, daarna `http://localhost:3000` (serve) of `:8080` openen.

## Domein

De werknaam is **stealr.app**. Het domein staat nog nergens hard behalve als placeholder `https://stealr.app/` (gemarkeerd met een `DOMAIN:`-comment in elk bestand). Staat het echte domein vast, vervang dan in één keer:

```bash
grep -rl "https://stealr.app/" site | xargs sed -i "s#https://stealr.app/#https://JOUWDOMEIN/#g"
```

Let op: `404.html` gebruikt absolute paden (`/css/...`) en gaat ervan uit dat de site in de root van het domein staat.

## Live zetten — optie A: GitHub Pages (gratis, uit deze repo)

GitHub Pages kan alleen de hele repo of de map `docs/` publiceren, niet `site/`. Daarom één klein workflow-bestand dat alleen `site/` uploadt:

1. Maak `.github/workflows/pages.yml` met deze inhoud en push naar `main`:

```yaml
name: Pages
on:
  push:
    branches: [main]
    paths: ["site/**"]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. GitHub → repo `stealr` → **Settings → Pages** → *Source*: **GitHub Actions**. Na de eerste run staat de site op `https://nickvhoornaar.github.io/stealr/`.
3. Bij **Custom domain** het domein invullen en **Enforce HTTPS** aanzetten zodra het certificaat er is (duurt tot een uur). Zet ook een bestand `site/CNAME` met alleen de domeinnaam erin, anders verdwijnt het domein bij de volgende deploy.

DNS bij de registrar (Nick):
- `A`-records voor het kale domein naar `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` voor `www` naar `nickvhoornaar.github.io`

## Live zetten — optie B: Netlify of Vercel (drag-and-drop, 5 minuten)

1. Account aanmaken (gratis plan volstaat), **Add new site → Deploy manually** (Netlify) of **New project** (Vercel).
2. De map `site/` erin slepen. De site staat direct op een `*.netlify.app`- of `*.vercel.app`-adres.
3. **Domain settings → Add custom domain** → het gekochte domein invullen. Netlify/Vercel toont dan precies welke DNS-records je bij de registrar moet zetten (meestal een `A`-record en een `CNAME` voor `www`). HTTPS is automatisch.

Koppel je de site aan de GitHub-repo in plaats van slepen, zet dan *Base directory* / *Root directory* op `site` en laat het build-commando leeg.

## Wat Nick moet doen

1. **Domein kiezen en kopen** (bijv. bij TransIP, Mijndomein of Cloudflare). Werknaam `stealr.app`; alternatieven `stealr.nl`, `stealr.run`.
2. **DNS instellen** volgens optie A of B hierboven.
3. Daarna de placeholder vervangen (zie *Domein*) en de nieuwe URL's invullen in App Store Connect en Play Console: privacy `…/privacy.html`, support `…/support.html`, account verwijderen `…/privacy.html#delete-account`.

## Regels voor wijzigingen

- Geen prijzen, geen cijfers die niet in de app staan, geen lanceerdatum.
- Feiten alleen uit de app en `docs/release/`.
- Afbeeldingen onder 300 KB; screenshots 600 px breed.
- Elke tekst in twee talen: `<span class="en">…</span><span class="nl" lang="nl">…</span>`.
