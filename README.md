# Personal Resume Website (Hugo)
[![Live](https://img.shields.io/badge/-Live%20%E2%86%97-14b8a6?style=flat-square)](https://ilxnah.github.io/resume/)
[![Build](https://img.shields.io/github/actions/workflow/status/ILXNAH/resume/hugo.yaml?branch=main&label=Build&style=flat-square)](https://github.com/ILXNAH/resume/actions/workflows/hugo.yaml)
[![Hugo](https://img.shields.io/badge/Hugo-e03582?style=flat-square&logo=hugo&logoColor=white)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/-Resume%20Theme-6f42c1?style=flat-square)](https://github.com/eddiewebb/hugo-resume)
[![GitHub Pages](https://img.shields.io/badge/-GitHub%20Pages-8b0000?style=flat-square&logo=github&logoColor=white)](https://pages.github.com/)
[![Cloudflare Worker](https://img.shields.io/badge/-Cloudflare%20Worker-1f2937?style=flat-square&logo=cloudflare&logoColor=F38020)](https://developers.cloudflare.com/workers/)
[![Credentials](https://img.shields.io/badge/-Credentials-%2386198f?style=flat-square&logo=adobeacrobatreader&logoColor=white)](https://github.com/ILXNAH/resume/releases/tag/credentials)
[![MIT](https://img.shields.io/static/v1?label=&message=MIT&color=0066cc&style=flat-square)](LICENSE)
[![CC BY-NC-ND 4.0](https://img.shields.io/static/v1?label=&message=CC%20BY-NC-ND%204.0&color=999999&style=flat-square)](LICENSE-CC)

Personal resume site built with Hugo (Resume theme), deployed to GitHub Pages;  
credential PDFs are served inline via a Cloudflare Pages Worker.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Theming & Assets](#theming--assets)
- [Local Dev](#local-dev)
- [Build & Deploy](#build--deploy)
- [PDF Hosting](#pdf-hosting)
- [Data & Content Structure](#data--content-structure)
- [Commit Conventions](#commit-conventions)
- [License](#license)
  - [Code](#code)
  - [Content](#content)
  - [Third-Party Components](#third-party-components)

## Features
- Clean, minimal site built with **Hugo**
- Deployed on **GitHub Pages**
- PDFs via **GitHub Releases**, proxied inline by a **Cloudflare Pages Worker**
- **Hugo Resume** theme with custom tweaks

- **Self-hosted assets (no external CSS/JS CDNs)**
  - **CSS:** all styles live in `assets/css/`, built via Hugo and served from this site
  - **Fonts:** Open Sans, Saira in `static/fonts/`, declared via `assets/css/fonts.css` (`@font-face`)
  - **JS:** vendor + site scripts from `static/js/` (incl. `static/js/vendor/`)

- **Hugo Pipes optimization**
  - Single bundled stylesheet (minified) with **fingerprinting** for cache-busting  
    *(emitted as `/public/css/app.min.<hash>.css`)*

## Technologies Used
- [Hugo](https://gohugo.io/) — static site generator (Extended; version pinned in [CI](.github/workflows/hugo.yaml))
- [Hugo Resume by Eddie Webb](https://github.com/eddiewebb/hugo-resume) — theme (as a git submodule)
- [GitHub Pages](https://pages.github.com/) — hosting
- [Cloudflare Pages Worker](https://developers.cloudflare.com/pages/functions/) — PDF proxy
- Fonts: [Open Sans](https://fonts.google.com/specimen/Open+Sans), [Saira](https://fonts.google.com/specimen/Saira)

## Theming & Assets
- **Theme (submodule) & safe customization**
  - Upstream theme lives in `themes/resume/` (git submodule). Avoid editing it directly; use local templates for easy updates.
    - Layout overrides: `layouts/_default/`, `layouts/partials/`
    - Shortcodes used by the resume sections: `layouts/shortcodes/` (e.g., `credentials.html`, `education.html`, `employment.html`, `languages.html`, `skills.html`)

- **CSS (self-hosted)**
  - Site styles in `assets/css/`:
    - `fonts.css` → `@font-face` declarations for local fonts
    - `resume-override.css`, `tweaks.css` → your safe override layers (don’t patch the theme files)
    - Vendor CSS in `assets/css/vendor/`
  - Built via **Hugo Pipes** into a single, minified, fingerprinted bundle (see [**Features**](#features)).

- **Fonts (self-hosted; third-party)**
  - Directories: `static/fonts/OpenSans/`, `static/fonts/Saira/`
  - Referenced from `assets/css/fonts.css` via `@font-face`
  - Licensing: **SIL OFL 1.1** — see **[NOTICE](./NOTICE)**

- **JavaScript (self-hosted)**
  - Site scripts in `static/js/`; vendor scripts in `static/js/vendor/`
  - No external JS CDNs (served locally).

- **Icons & Favicons**
  - Favicons & manifests: `static/icons/` (`favicon.ico`, `site.webmanifest`, etc.)
  - Template tags for icons live in `layouts/partials/favicon.html` — update filenames there if you replace assets.

## Local Dev
Prereqs: Hugo **Extended**; init theme submodule once (after cloning):
  ```bash
  git submodule update --init --recursive
  ```

Run: 
  ```bash
  hugo server -D --disableFastRender
  ```

Open: [http://localhost:1313/resume/](http://localhost:1313/resume/) (with `baseURL = "/resume/"` set in `config.toml`)

## Build & Deploy
Deployed via **GitHub Pages** (see [`.github/workflows/hugo.yaml`](.github/workflows/hugo.yaml))

- **Build (local):**

   ```bash
   hugo --gc --minify --cleanDestinationDir
   ```

- **CI flow:**
   - **Trigger:** push to `main` (only when site files change) or manual dispatch
   - **Build:** install Hugo Extended, checkout with submodules, baseURL injected by Pages
   - **Deploy:** upload build artifact, then deploy via GitHub Pages

- **Change-gating:** build/deploy runs only when site files change (`assets/`, `content/`, `data/`, `layouts/`, `static/`, `themes/`, `config.toml`, or `.github/workflows/**`), or when manually dispatched.

- **Hugo install & version pinning:** CI uses `peaceiris/actions-hugo@v2` (Extended), with the version pinned by the `HUGO_VERSION` env.

- **Cache:** restores/saves `HUGO_CACHEDIR` between runs to speed builds.  
  Cache key: `${{ runner.os }}-hugo-${{ env.HUGO_VERSION }}-${{ hashFiles('config.toml') }}` (invalidates when OS/Hugo version or `config.toml` changes).

- **Artifact & retention:** the built site (`/public`) is uploaded via `actions/upload-pages-artifact@v3` with **90-day** retention, then deployed by `actions/deploy-pages@v4`.

- **Concurrency:** `concurrency: { group: pages, cancel-in-progress: true }` prevents overlapping deployments.

- **Traceability:** the site footer shows “Page content generated from commit …” and links to the exact Git commit used for that page.
   - Ensure `enableGitInfo = true` in `config.toml`, and set `fetch-depth: 0` on `actions/checkout` in CI so commit metadata is available.

## PDF Hosting
PDF files (e.g., certificates) are stored as **GitHub Release assets** (tag `credentials`) and served inline via a **Cloudflare Pages Worker** under the Pages domain.

They are exposed under short URLs like `https://ilxnah.pages.dev/<file>.pdf`.

**Why a worker?** Ensures PDFs render inline and are browser-cached (~1 hour). See [cloudflare/README.md](./cloudflare/README.md) for exact headers, caching, deploy steps and instructions on adding a new PDF.

## Data & Content Structure
Credential data lives in `data/` as JSON (e.g., `data/certifications.json`, `data/certificates.json`, `data/courses.json`).  
Each item links to a PDF proxied by Cloudflare (Pages domain). 

**Minimal data model:**
```json
{
  "title": "CyberEdu NIS2 Academy",
  "subtitle": "MoyaKybeon Cybersecurity Manager",
  "issuer": "Netia s.r.o.",
  "url": "https://ilxnah.pages.dev/cyberedu-nis2-academy.pdf",
  "date": "2025-03-07"
}
```
- **Filenames:** use **kebab-case**, lowercase, with the `.pdf` extension (e.g., `prince2-agile-practitioner.pdf`).
- **URL mapping:** short URL = `https://ilxnah.pages.dev/<filename>.pdf` — `<filename>` **must** match the Release asset name exactly.
- **JSON `.url`:** always point to the Pages URL (not the GitHub Releases URL).
- **Dates:** use ISO 8601 (`YYYY-MM-DD`) in `date`.
- **Where it renders:** credentials are read from `data/*.json` and displayed by the site’s shortcodes/partials.

## Commit Conventions
- Follow [Conventional Commits](https://www.conventionalcommits.org/) style.
- Use a **type** and a **scope** in round brackets (e.g., `feat(credentials)`).
- Scope = logical area of change (e.g., `credentials`, `styles`, `config`).
- Do **not** use filenames or file paths in scope.
- **Title line**: short, concise, must fit on one line (no wrapping).
- **Commit body**: optional; when used, written in bullet-point format.
- A commit message template is provided in [`.gitmessage.txt`](./.gitmessage.txt).
  - To enable it, run:  
    ```bash
    git config commit.template .gitmessage.txt
    ```
  - After setup, simply run `git commit` (without `-m`) and the template will preload in your editor.

## License
*Dual-license: MIT (code) + CC BY-NC-ND 4.0 (content).*   
Please refer to each license file for the full terms.

### Code
- **Source code, scripts, and configuration files** are licensed under the [MIT License](./LICENSE).  
- **Includes (non-exhaustive):** `config.toml`, `.github/`, `.vscode/`, `assets/` (CSS/JS), `layouts/`, `static/js/`, `cloudflare/`, and other build/config files.  
- **Excludes:** submodules (e.g., `themes/resume/`), generated output such as `public/` and `resources/_gen/`.

### Content
- **Written content, data, and personal files** are licensed under [CC BY-NC-ND 4.0](./LICENSE-CC).  
- **Includes (non-exhaustive):** `content/`, `data/` (JSON entries), `static/images/`, `static/icons/`, and certificates/credentials in GitHub Releases.  

### Third-Party Components
This project uses third-party components that are subject to their own licenses. For details on those components (e.g., fonts, Hugo Resume theme) and a full breakdown of licensing scopes, see the [NOTICE](./NOTICE) file.
