const express = require('express');
const { createProxyMiddleware, responseInterceptor} = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow cross-origin if needed (especially for service workers)
app.use(cors({
    origin: '*', // Allow all origins (adjust as needed for security)
    credentials: true
}));
app.use(express.static('public'));

// Route pattern: /abc.com/some/path → proxies to https://abc.com/some/path

/*app.use('/:domain(*)', (req, res, next) => {
    const fullPath = req.params.domain; // this now includes domain and possible subpath
    const parts = fullPath.split('/');
    const domain = parts.shift();
    const remainingPath = '/' + parts.join('/');

    const targetUrl = `https://${domain}`;

    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => remainingPath,
        onProxyReq: (proxyReq) => {
            proxyReq.setHeader('Referer', targetUrl + remainingPath);
        },
        onProxyRes: (proxyRes, req, res) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
                const updatedCookies = cookies.map(cookie =>
                    cookie
                        .replace(/Domain=[^;]+;?/gi, '') // remove original domain
                        .replace(/;?\s*Secure/gi, '') // remove Secure (add later)
                        .replace(/;?\s*SameSite=[^;]+/gi, '') // remove SameSite
                    + '; Path=/; Secure; SameSite=None' // add for iOS/Safari
                );
                proxyRes.headers['set-cookie'] = updatedCookies;
            }
        },
        onError: (err, req, res) => {
            res.status(500).send('Proxy error: ' + err.message);
        }
    });

    proxy(req, res, next);
});*/

// Reverse proxy
app.use('/:domain(*)', (req, res, next) => {
    const fullPath = req.params.domain;
    const parts = fullPath.split('/');
    const domain = parts.shift();
    const subPath = parts.join('/');
    const targetUrl = `https://${domain}`;
    const prefix = `/${domain}`;
    console.log("Domain:", domain);
    console.log("Rewriting path:", '/' + subPath);
    console.log("Proxying to:", targetUrl + '/' + subPath);

    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        //pathRewrite: () => '/' + subPath,
        pathRewrite: {
            [`^/${domain}`]: '' // Strip the domain from URL when forwarding to target
        },
        onProxyReq: (proxyReq) => {
            proxyReq.setHeader('Referer', targetUrl + '/' + subPath);
            proxyReq.setHeader('Host', domain);
        },
        selfHandleResponse: true, // Required for intercepting response
        onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            const contentType = proxyRes.headers['content-type'] || '';
            if (contentType.includes('text/html')) {
                let html = responseBuffer.toString('utf8');

                // Rewrite links like href="/..." or src="/..."
                html = html.replace(/(href|src|action)=["']\/(?!\/)/g, `$1="${prefix}/`);

                return html;
            }

            return responseBuffer; // No modification for non-HTML
        }),
        onError: (err, req, res) => {
            res.status(500).send('Proxy error: ' + err.message);
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`✅ Reverse proxy running on http://localhost:${PORT}`);
});