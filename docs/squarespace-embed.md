# Squarespace embed snippet

Before using this snippet, set `EMBED_ALLOWED_ORIGIN` in the Vercel project's environment variables to the exact origin of the Squarespace site this will be embedded on — protocol plus host, no trailing slash (e.g. `https://www.example.com`) — then redeploy. Until that is done, the app serves `Content-Security-Policy: frame-ancestors 'self'` on `/`, and the browser will refuse to render the iframe on any third-party site.

Paste the following into a Squarespace Code Block:

```html
<iframe
  id="grievability-audit"
  src="https://grievabilityaudit.com/"
  title="The Grievability Audit"
  style="width: 100%; height: 800px; border: 0;"
></iframe>
<script>
  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://grievabilityaudit.com') return;
    if (!event.data || event.data.type !== 'grievability-audit:resize') return;
    document.getElementById('grievability-audit').style.height = event.data.height + 'px';
  });
</script>
```
