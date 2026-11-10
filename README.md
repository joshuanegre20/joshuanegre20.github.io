# Developer Portfolio

Personal portfolio built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com): hero + about, projects, an MDX blog with RSS, and a contact section. Static output, dark mode, sitemap, and SEO meta tags included.

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Dev server at `http://localhost:4321`        |
| `npm run build`   | Build the static site to `./dist/`           |
| `npm run preview` | Preview the production build locally         |
| `npm run check`   | Type-check `.astro` files and content schemas |

## Make it yours

1. **Your details** — everything personal is in `src/data/site.ts`: name, headline, intro, location and time zone, "Now" line, about text, skills, experience, email, social links, résumé. Write it in your own voice. Specific, plain sentences are what make a portfolio feel human.
2. **Site URL** — set `site` in `astro.config.mjs` to your real domain (used for sitemap, RSS, canonical URLs).
3. **Photo** — replace `public/avatar.svg` with a real photo. A 4:5 portrait works best. Use the same path, or update it in `src/components/AboutSection.astro`.
4. **Résumé** — put `resume.pdf` in `public/` and set `resume: '/resume.pdf'`. A "Résumé" button then appears in the header.
5. **Projects / case studies** — one Markdown file per project in `src/content/projects/`. Each one gets its own page at `/projects/<file-name>`.
   - Frontmatter: `title`, `description`, `year`, `role`, `outcome` (your headline result, ideally a number), `tech`, `image`, `repo`, `demo`, `featured`, `order`.
   - Keep the four body headings: *The problem*, *What I did*, *Results*, *What I'd do differently*. They answer what a hiring manager wants to know.
   - Screenshots go in `public/projects/` (16:10 works best).
6. **Writing** — add `.md` / `.mdx` files to `src/content/blog/` with `title`, `description`, `pubDate`, `tags`, and optional `draft: true` (drafts show in dev only).
7. **Colors** — the palette is in CSS variables at the top of `src/styles/global.css`, with light and dark versions. Keep text colors at 4.5:1 contrast or better.
8. **Social preview image (optional)** — add a 1200×630 PNG to `public/` and pass it to `BaseLayout` as `image`.

## Deploy

It's a static site, so any static host works:

- **Vercel / Netlify / Cloudflare Pages** — import the repo; build command `npm run build`, output directory `dist`.
- **GitHub Pages** — use the [official Astro GitHub Action](https://docs.astro.build/en/guides/deploy/github/).

## Note on Windows Application Control

This machine's Windows Application Control policy (for example Smart App Control) blocks some unsigned native Node binaries, including the Astro compiler and the `satteri` Markdown parser. To work around this:

- `@astrojs/compiler-binding-wasm32-wasi` and `@bruits/satteri-wasm32-wasi` are installed as WebAssembly fallbacks. The native binaries are still used wherever they are allowed to load, such as on CI and hosting.
- `.npmrc` sets `force=true` so `npm install` doesn't skip those WASM packages as "wrong platform".
- Tailwind **v3** is used instead of v4. On Windows, v4's WASM fallback can't scan source files, so it produces no utility classes. If you move to a machine without this policy, you can upgrade to v4 with `npx @tailwindcss/upgrade`.
- The `ExperimentalWarning: WASI is an experimental feature` message in the console is expected and harmless.
