const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 5006;

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5005',
  changeOrigin: true,
}));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});