import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { localAIResponse } from "./ai/localAI.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Proxy Core ======
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Error: Missing 'url' parameter");

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send("Proxy Error: " + err.message);
  }
});

// ====== DuckDuckGo Proxy ======
app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).send("Missing query");
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;

  try {
    const r = await fetch(url);
    const html = await r.text();
    res.send(html);
  } catch (err) {
    res.status(500).send("Search Proxy Error: " + err.message);
  }
});

// ====== Local AI Chat ======
app.post("/ai", (req, res) => {
  const { message } = req.body;
  const reply = localAIResponse(message || "");
  res.json({ reply });
});

// ====== Serve Frontend ======
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ====== Start ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at port ${PORT}`);
});
