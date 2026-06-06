# fixmy.codes — notes for Claude

Eric's personal site: a portfolio + blog hybrid built with **Astro**, deployed to
Azure Static Web Apps. See `README.md` for the full file structure.

## Style brief (important)
**Bland and minimal.** Eric rewrites all prose himself. Anything generated here is
a structural template to be replaced, not final copy. Don't over-design.

## How it deploys
Push to `main` → GitHub Actions builds and deploys to Azure SWA `fixmy-codes`
(resource group `fixmy-codes`, West US 2). Live at https://fixmy.codes.

## Common edits
- New blog post: add `src/content/blog/<name>.md` (frontmatter: `title`, `pubDate`,
  optional `description`, `tags`, `draft`).
- New project: add `src/content/projects/<name>.md`.
- Restyle: edit the CSS variables at the top of `src/styles/global.css`.

## Domain / DNS
Registered at Namecheap; apex points to the SWA via an `ALIAS` record. Manage the
domain and DNS with the `namecheap` CLI (`~/Claude/tools/namecheap/`), not the
Namecheap website. The pre-migration DNS zone backup is in `_archive/`.
