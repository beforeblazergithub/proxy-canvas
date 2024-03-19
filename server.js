const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const targetUrl = 'https://y115.instructure.com';

app.use(cors());

app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type'];
        let response = responseBuffer.toString('utf8');

        // Only modify HTML content
        if (contentType && contentType.includes('text/html')) {
            const script = `<script>(function() { setTimeout(function() { console.log('Hello World'); }, 500); })();</script>`;
            response = response.replace('<head>', `<head>${script}`);
        }

        return response;
    })
}));

app.listen(3000, () => {
    console.log('Proxy server listening on http://localhost:3000');
});