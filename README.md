# fixmy.codes

Personal site — a portfolio + blog hybrid built with [Astro](https://astro.build).
Static output, deployed to Azure Static Web Apps.

## Structure

```
src/
  content/
    blog/        ← one Markdown file per post  (drop a file = new post)
    projects/    ← one Markdown file per project
    content.config.ts ← frontmatter schemas for both collections
  layouts/       ← page shells: BaseLayout, PostLayout, ProjectLayout
  components/    ← Header, Footer, PostCard, ProjectCard, FormattedDate
  pages/
    index.astro          ← home (intro + featured projects + recent posts)
    blog/index.astro     ← post list      (auto-generated)
    blog/[...slug].astro ← renders a post
    projects/index.astro ← project grid
    projects/[...slug].astro ← renders a project
    about.astro          ← about / contact
    404.astro
    rss.xml.js           ← RSS feed at /rss.xml
  styles/global.css ← all visual tokens (colors, type, spacing) live here
public/            ← static assets, favicon, staticwebapp.config.json
```

## Common edits

- **New blog post:** add `src/content/blog/<name>.md` with frontmatter
  (`title`, `pubDate`, optional `description`, `tags`, `draft`). It appears on
  `/blog` and in the RSS feed automatically.
- **New project:** add `src/content/projects/<name>.md` (`title`, `summary`,
  `status`, optional `link`, `repo`, `order`).
- **Restyle:** edit the CSS variables at the top of `src/styles/global.css`.
- **Hide something:** set `draft: true` in its frontmatter.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # static build into dist/
npm run preview  # serve the built site
```

## Deploy

Push to `main`. GitHub Actions builds and deploys to the Azure Static Web App
`diane-dashboard` (resource group `diane-dashboard`), which serves
`fixmy.codes`. The workflow uses the repo secret
`AZURE_STATIC_WEB_APPS_API_TOKEN` (the app's deployment token).

> The Azure resource is named `diane-dashboard` for historical reasons (it
> previously hosted an avatar-prototype dashboard). It now serves this site.

The `_archive/` folder holds a snapshot of the previous site that lived here.
