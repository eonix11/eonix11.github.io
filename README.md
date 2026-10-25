# eonix11.github.io

Personal blog. Built with [Astro](https://astro.build), deployed to GitHub Pages.

Live: https://eonix11.github.io

## Run locally

Requires Node 22.23 or newer.

```bash
npm install
npm run dev       # dev server at http://localhost:4321 (drafts are shown)
npm run build     # type check + production build into dist/
npm run preview   # serve dist/ locally
```

In Astro 7, `npm run dev` starts the server in the background. Stop it with `npx astro dev stop`.

## Add a new post

1. Copy `src/content/posts/_template.md` to `src/content/posts/<slug>.md` (or `.mdx`).
2. Fill in the frontmatter. The build fails if a required field is missing or wrong.
3. Write the post. The URL is `/posts/<slug>/`.
4. Set `draft: true` to keep it out of production while you write.

Frontmatter:

| Field         | Required | Notes                                                    |
| ------------- | -------- | -------------------------------------------------------- |
| `title`       | yes      |                                                          |
| `date`        | yes      | `YYYY-MM-DD`. Posts are sorted by this, newest first.    |
| `description` | yes      | Used for meta tags, link previews, and RSS.              |
| `tags`        | no       | e.g. `[security, linux]`. Each tag gets a page.          |
| `code`        | no       | URL to the folder in `eonix11/learning-log`.             |
| `draft`       | no       | Default `false`. Drafts show in dev only.                |

The schema is in `src/content.config.ts`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. `withastro/action` installs dependencies and builds the site.
2. `actions/deploy-pages` publishes `dist/` to GitHub Pages.

Repo setting needed once: **Settings → Pages → Source: GitHub Actions**.

## Layout

```
src/
  consts.ts             site name, tagline, links
  content.config.ts     post schema (zod)
  content/posts/        posts (files starting with "_" are ignored)
  layouts/              BaseLayout: meta tags, header, footer
  components/           Header, Footer, PostList
  pages/                routes: home, posts, tags, about, 404, rss.xml
  styles/global.css     all styles
  utils/posts.ts        post queries, reading time, date format
public/                 favicon, og.png (link preview image)
```
