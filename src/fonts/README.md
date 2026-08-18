# Fonts

These WOFF2 files are **self-hosted on purpose**. `next/font/google` fetches
from `fonts.googleapis.com` at build time, which breaks offline/air-gapped CI
and adds a third-party dependency to every build. Shipping the files means the
build is hermetic and no request ever leaves the visitor's browser for a font.

Each file is the **variable (weight-axis) Latin subset**, taken from the
corresponding [Fontsource](https://fontsource.org) package.

| File | Family | Axis | Upstream | Licence |
| --- | --- | --- | --- | --- |
| `cinzel-latin-wght-normal.woff2` | Cinzel | `wght 400–900` | [`@fontsource-variable/cinzel`](https://www.npmjs.com/package/@fontsource-variable/cinzel) | SIL OFL 1.1 |
| `playfair-display-latin-wght-normal.woff2` | Playfair Display | `wght 400–900` | [`@fontsource-variable/playfair-display`](https://www.npmjs.com/package/@fontsource-variable/playfair-display) | SIL OFL 1.1 |
| `playfair-display-latin-wght-italic.woff2` | Playfair Display *Italic* | `wght 400–900` | same | SIL OFL 1.1 |
| `inter-latin-wght-normal.woff2` | Inter | `wght 100–900` | [`@fontsource-variable/inter`](https://www.npmjs.com/package/@fontsource-variable/inter) | SIL OFL 1.1 |
| `jetbrains-mono-latin-wght-normal.woff2` | JetBrains Mono | `wght 100–800` | [`@fontsource-variable/jetbrains-mono`](https://www.npmjs.com/package/@fontsource-variable/jetbrains-mono) | SIL OFL 1.1 |

The SIL Open Font License 1.1 permits bundling and redistribution with a
project. The full licence text is available at
<https://openfontlicense.org> and in each upstream package's `LICENSE` file.

## Refreshing or adding a subset

```bash
npm i -D @fontsource-variable/cinzel
cp node_modules/@fontsource-variable/cinzel/files/cinzel-latin-wght-normal.woff2 src/fonts/
npm un @fontsource-variable/cinzel
```

Then register it in `src/fonts/index.ts` with `next/font/local` and expose it as
a CSS variable. `src/app/globals.css` consumes those variables via
`--font-display`, `--font-serif`, `--font-ui` and `--font-mono`.

If you need non-Latin coverage, copy the matching `*-latin-ext-*`,
`*-cyrillic-*` or `*-vietnamese-*` file as an additional `src` entry with the
right `unicodeRange`.
