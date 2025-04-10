//pwa-mdr.dev-public.bbpd.io
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use((req, res, next) => {
    const parts = req.path.split('/');
    const isDomain = parts[1]?.includes('.');
    if (!isDomain) {
        req.url = `/pwa-mdr.dev-public.bbpd.io${req.url}`;
    }
    next();
});

app.use('/:domain', (req, res, next) => {
    const domain = req.params.domain;
    const path = req.originalUrl.replace(`/${domain}`, '');
    const target = `https://${domain}`;

    // ✅ Log the full proxied URL
    console.log(`[Proxying] ${req.method} ${req.originalUrl} → ${target}${path}`);

    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^/${domain}`]: '',
        },
    })(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Reverse proxy running at http://localhost:${PORT}`);
});
