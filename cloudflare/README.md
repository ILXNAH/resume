# Cloudflare Worker (PDF Proxy)

Serves **GitHub Release** PDFs inline under the Pages domain.

- **Source:** `cloudflare/_worker.js`
- **Upstream:** `https://github.com/ILXNAH/resume/releases/download/credentials/<file>.pdf`
- **Public URLs (handled by Worker):**
  - `https://ilxnah.pages.dev/<file>.pdf`  ← preferred, short
  - `https://ilxnah.pages.dev/docs/credentials/<type>/<file>.pdf`  *(fallback)*

`<type>` can be `certifications`, `certificates`, or `courses` (for pretty URLs only).

## Deploy (Pages, direct upload)
1) Create a ZIP containing **only** `_worker.js` at the root.  
2) Cloudflare Dashboard → **Pages** → project `ilxnah` → **Create deployment** → upload ZIP.

Worker sets:
- `Content-Disposition: inline`
- `Content-Type: application/pdf`
- `Cache-Control: public, max-age=3600`

## Add a new PDF
1) Upload the file to the `credentials` **Release** (Assets) in GitHub.  
2) Use a unique, kebab-case filename.  
3) In Hugo data JSON, link to the Pages URL, e.g.:
   ```json
   { "url": "https://ilxnah.pages.dev/prince2-agile-expert.pdf" }
   ```
4) Open the URL to confirm it renders inline.