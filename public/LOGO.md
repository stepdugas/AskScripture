# Logo files

Drop the designer's exported files into `/public/` using the exact names
below and they'll appear everywhere automatically. The header and footer
already reference `/logo.svg` via `<Image>` so the swap is one paste.

## One thing to confirm with the designer

The approved design (magnifying glass + open book + sparkle + "ASK
SCRIPTURE" wordmark) is rendered light-on-dark — white elements on a
black background. **The AskScripture site is light-on-paper** (`#FBFAF7`
background), so the white version will be invisible against the page.

Two variants are needed:

1. **Dark variant** — same logo with marks/text in ink navy (`#1B2845`) or
   solid black, **transparent** background. This is the primary one used on
   the site (header, footer, print PDF chrome).
2. **Light variant** — current white-on-transparent. Useful for the email
   digest header and dark-mode social cards.

## Files (drop into `/public/`)

```
public/
  logo.svg                  Horizontal wordmark — DARK variant for site use
  logo-mark.svg             Just the magnifying-glass mark, no wordmark — DARK
  logo-light.svg            Optional: white-on-transparent for dark surfaces
  icon.svg                  Same as logo-mark.svg, optimized for 16-32px favicon
  icon-192.png              192×192 PNG — Android home screen
  icon-512.png              512×512 PNG — large PWA icon
  icon-512-maskable.png     512×512 PNG — Android adaptive (safe content in middle 80%)
  apple-touch-icon.png      180×180 PNG — iOS home screen
  favicon.ico               Multi-size .ico (16, 32, 48) — legacy browsers
```

## Generating the PNG sizes

If the designer hands over an SVG, generate the PNGs locally:

```sh
brew install librsvg
cd ~/Desktop/askscripture/public
rsvg-convert logo-mark.svg -w 180 -o apple-touch-icon.png
rsvg-convert logo-mark.svg -w 192 -o icon-192.png
rsvg-convert logo-mark.svg -w 512 -o icon-512.png
rsvg-convert logo-mark.svg -w 512 -o icon-512-maskable.png
```

Most designers can do this directly in Figma / Illustrator with their PNG
export presets — same result, no terminal involvement needed.

## Where they're wired (no code edits required once files land)

| File | Used by |
|---|---|
| `logo.svg` | `src/components/site-header.tsx`, `src/components/site-footer.tsx` |
| `logo-mark.svg` | OG images, print PDF chrome |
| `icon.svg` | Browser tab favicon, PWA install on modern browsers |
| `icon-192.png` / `icon-512.png` | PWA manifest, Android home screen |
| `icon-512-maskable.png` | Android adaptive icon |
| `apple-touch-icon.png` | iOS "Add to Home Screen" |
| `favicon.ico` | Legacy browsers and OS shortcuts |
