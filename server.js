const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy API requests to Flask
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000", // Flask app running on port 5000
    changeOrigin: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Node.js!");
});

app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
