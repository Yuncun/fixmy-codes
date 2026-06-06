# fixmy.codes — notes for Claude

Eric's personal site: a portfolio + blog hybrid built with **Astro**, deployed to
Azure Static Web Apps. See `README.md` for the full file structure.

## Where everything lives (this repo is the entry point)
- **Site code:** this repo — `~/Claude/fixmy-codes/` (GitHub: `Yuncun/fixmy-codes`)
- **Hosting:** Azure Static Web App `fixmy-codes`, resource group `fixmy-codes` (West US 2). Portal: `https://portal.azure.com/#@6ce28f09-9572-4de1-8dda-ba0527aeb94e/resource/subscriptions/762d60fe-bac2-48df-afca-82082be91379/resourceGroups/fixmy-codes/providers/Microsoft.Web/staticSites/fixmy-codes`
- **Domain + DNS tool:** `tools/namecheap/` in this repo — run `python3 tools/namecheap/nc.py <cmd>` (no global install; scoped to this project)
- **Namecheap credentials:** `~/.config/namecheap/credentials.json` (chmod 600)
- **DNS zone backup:** `_archive/dns-snapshot-2026-06-05.json`

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
domain and DNS with the in-repo tool (`python3 tools/namecheap/nc.py …`), not the
Namecheap website. The pre-migration DNS zone backup is in `_archive/`.
