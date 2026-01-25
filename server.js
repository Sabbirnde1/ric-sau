const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Example: custom API route (optional)
  server.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Next.js 13 is running 🚀" });
  });

  // Let Next.js handle everything else
  server.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Next.js app ready on http://localhost:${port}`);
  });
});
