# SignMyWord

**Type it. Fingerspell it. Share it.**

SignMyWord is a responsive BSL/ASL fingerspelling generator built around clear output, accessible typography and easy sharing.

## Current features

- British Sign Language (BSL) and American Sign Language (ASL)
- Words and multi-word phrases with clear word grouping
- Responsive desktop/mobile sign cards
- Local-first A–Z SVG assets with Wikimedia fallback
- BSL artwork cropping/rasterisation for reliable share-image export
- Shareable links, WhatsApp and native sharing
- Portrait, square and story image exports
- Light, dark, colourful, love, birthday and school image themes
- Copy generated image to clipboard where supported
- Private recent searches on the current device
- “Surprise me” phrase discovery
- Practice mode that hides answers
- Printable classroom worksheet / save-to-PDF page
- Embeddable result mode using `?embed=1`
- Desktop trending-word UI with count badges
- Optional anonymous site-wide trending backend template
- Basic local conversion metrics with optional `dataLayer` hooks
- SEO landing pages and sitemap
- Inter headings + Atkinson Hyperlegible Next UI/body typography

## Useful URLs

Generator:

```
https://signmyword.com/?lang=bsl&word=HELLO
```

Embed:

```
https://signmyword.com/?lang=bsl&word=HELLO&embed=1
```

Classroom worksheet:

```
https://signmyword.com/classroom.html
```

Sitemap:

```
https://signmyword.com/sitemap.xml
```

Local testing insights:

```
https://signmyword.com/stats.html
```

The insights page is intentionally `noindex` and reports only metrics stored in that browser.

## Local alphabet artwork

The app now tries these local files first:

```
assets/bsl/A.svg … Z.svg
assets/asl/A.svg … Z.svg
```

The workflow `.github/workflows/signmyword-assets.yml` downloads the 52 Wikimedia SVGs monthly and can also be run manually. If a local asset is missing, the app falls back to Wikimedia Commons.

BSL filenames:

```
BSL_letter_A.svg
```

ASL filenames:

```
Sign_language_A.svg
```

See `assets/README.md` and `terms.html#artwork` for source/licence notes.

## Optional shared trending backend

The normal static site works without a backend and keeps trend data on the visitor’s device.

For site-wide anonymous trends, deploy:

```
backend/cloudflare-worker.js
```

with a Cloudflare KV binding named `SIGNMYWORD_TRENDS`, then define:

```html
<script>
  window.SIGNMYWORD_POPULAR_API = "https://your-worker.example.workers.dev";
</script>
```

before `app.js`.

The worker publishes only terms with at least three searches and does not intentionally store user identities in the trend records.

## Classroom mode

`classroom.html` accepts up to 10 words or phrases and supports:

- BSL / ASL switching
- printable fingerspelling cards
- answer-hidden quiz mode
- browser Print / Save PDF

## Product wording

SignMyWord is a **fingerspelling reference tool**. It is not a full English-to-sign-language translation service.

## Design source

Figma:
https://www.figma.com/design/Op1JXflSDiXc1FT907cPIa

## Future expansion

Keep BSL and ASL stable before adding additional verified fingerspelling alphabets. Potential future work includes richer analytics, organisation-branded embeds, offline/PWA support and more data-driven SEO pages.
