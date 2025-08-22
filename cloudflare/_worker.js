export default {
  async fetch(req) {
    const u = new URL(req.url);
    let file = null;

    // New short form: /file.pdf
    if (/^\/[^/]+\.pdf$/i.test(u.pathname)) {
      file = u.pathname.slice(1);
    }
    // Back-compat: /docs/credentials/<type>/<file>.pdf
    else if (u.pathname.startsWith('/docs/credentials/')) {
      const parts = u.pathname.split('/').filter(Boolean); // ['docs','credentials',type,'file.pdf']
      const type = parts[2];
      if (!['certifications','certificates','courses'].includes(type))
        return new Response('Not found', { status: 404 });
      file = parts[3];
    } else {
      return new Response('ok');
    }

    const gh = `https://github.com/ILXNAH/resume/releases/download/credentials/${file}`;
    const r = await fetch(gh, { headers: { 'User-Agent': 'cf-proxy' } });
    if (!r.ok) return new Response(`Upstream ${r.status}`, { status: r.status });

    const h = new Headers(r.headers);
    h.set('Content-Disposition', `inline; filename="${file}"`);
    h.set('Content-Type', 'application/pdf');
    h.delete('X-Content-Type-Options');
    h.set('Cache-Control', 'public, max-age=3600');

    return new Response(r.body, { status: r.status, headers: h });
  }
}
