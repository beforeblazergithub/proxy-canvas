const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000; // Hardcoded port number
const targetUrl = 'https://y115.instructure.com'; // Hardcoded target URL

app.use(cors());

app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type'];
        let response = responseBuffer.toString('utf8');

        if (contentType && contentType.includes('text/html')) {
            const script = `<script>(function() { setTimeout(function() {alert('Hello World'); }, 5000); })();</script>`;
            response = response.replace('<head>', `<head>${script}`);
        }

        return response;
    })
}));

app.listen(PORT, () => {
    console.log(`Proxy server listening on http://localhost:${PORT}`);
});
