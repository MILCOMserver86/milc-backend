import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// ---- FIXED CORS CONFIG ----
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Explicit preflight handler
app.options("/data", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// Parse JSON bodies
app.use(express.json());

// ---- LOAD DATA (with no caching) ----
app.get("/data", (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const json = JSON.parse(raw || "{}");
    res.json(json);
  } catch (err) {
    console.error("Error reading data.json:", err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

// ---- SAVE DATA ----
app.post("/data", (req, res) => {
  try {
    const body = req.body;

    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), "utf8");

    res.json({ ok: true });
  } catch (err) {
    console.error("Error writing data.json:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("MILC backend is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
