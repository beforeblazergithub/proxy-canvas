const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const targetUrl = 'https://y115.instructure.com';  // Target URL

app.use(cors());

const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: false,  // Let the proxy middleware handle the response
    onProxyRes: function (proxyRes, req, res) {
        if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
            let location = proxyRes.headers.location;

            // Check if the redirect location matches the target URL
            if (location.startsWith(targetUrl)) {
                // Rewrite the location to go through the proxy server
                location = location.replace(targetUrl, 'https://proxy-canvas.onrender.com');
            } else if (!location.startsWith('http')) {
                // Handle relative redirects by prefixing with the proxy server URL
                location = 'https://proxy-canvas.onrender.com' + location;
            }

            proxyRes.headers.location = location;
        }
    },
});

app.use('/', proxy);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});
