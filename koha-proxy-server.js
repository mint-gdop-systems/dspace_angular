const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api/v1', createProxyMiddleware({
  target: 'http://127.0.0.1:8085',
  changeOrigin: true,
  logLevel: 'debug'
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Koha proxy server running on http://localhost:${PORT}`);
});