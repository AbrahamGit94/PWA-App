const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow cross-origin if needed (especially for service workers)
app.use(cors());

// Route pattern: /abc.com/some/path → proxies to https://abc.com/some/path
app.use('/:domain/*', (req, res, next) => {
    const requestedDomain = req.params.domain;
    const path = req.params[0];
    const targetUrl = `https://${requestedDomain}`;

    console.log(`[Proxy] ${req.originalUrl} → ${targetUrl}/${path}`);

    // Validate domain (optional: check against allow-list)
    const domainRegex = /^[a-zA-Z0-9.-]+$/;
    if (!domainRegex.test(requestedDomain)) {
        return res.status(400).send('Invalid domain format');
    }

    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: { [`^/${requestedDomain}`]: '' },
        onProxyReq: (proxyReq, req, res) => {
            // Set dynamic Referer header
            const refererHeader = `https://${requestedDomain}`;
            proxyReq.setHeader('Referer', refererHeader);

            // Optional: Set Host header too
            proxyReq.setHeader('Host', requestedDomain);
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(` Reverse proxy listening at http://localhost:${PORT}`);
});
