# Blog Content Workflow

How blog posts go from idea to deployed on [clowd.bot/blog](https://clowd.bot/blog/).

## Pipeline

### 1. Research
- Analyze competitive landscape, identify content gaps
- Gather data, sources, and external links
- Output: research notes (kept locally, not committed)

### 2. Write
- Draft in Markdown (`.md`) locally
- Follow the voice guide in `writing-style.md` (project root, not in this repo)
- Follow the SEO checklist in `seo-guidelines.md` (project root, not in this repo)
- Output: `.md` draft file

### 3. Edit
- Editor reviews for voice, accuracy, SEO requirements
- Ensure question-based H2 headings, search-optimized intro, FAQ section
- Comparison posts need an at-a-glance table near the top
- Output: approved `.md` file

### 4. Convert to HTML
- Convert the approved Markdown to a full HTML page
- Use an existing post (e.g., `blog/hello-world.html`) as the template
- Template includes: GTM, PostHog analytics, Open Graph tags, Twitter Cards, BlogPosting structured data, site nav, site footer, cross-domain link decoration script
- **Do not deploy Markdown files.** Only `.html` files go into the repo.
- Output: `blog/[slug].html`

### 5. Update index files
Four files must be updated when adding a new post:
- `blog/posts.json` — add entry at top of `posts` array (newest first)
- `blog/feed.xml` — add `<item>` entry (newest first)
- `blog/index.html` — add article card in both human and agent mode views
- `sitemap.xml` — add `<url>` entry

### 6. Deploy
- Commit the `.html` file + updated index files
- Push to `main` on `circuitandchisel/clowdbot-site`
- GitHub Pages auto-deploys on push
- Verify the post renders correctly at its canonical URL

## What goes in this repo

- `blog/*.html` — published blog posts
- `blog/posts.json` — machine-readable post index
- `blog/feed.xml` — RSS feed
- `blog/index.html` — blog listing page
- `blog/images/` — post images
- `sitemap.xml` — sitemap

## What stays local (not committed)

- `.md` draft files — used during writing/editing, converted to HTML before deploy
- `writing-style.md` — voice guide for authors and agents
- `seo-guidelines.md` — SEO checklist and content pillar keywords
- `research/` — competitive research, topic ideas, strategy docs
