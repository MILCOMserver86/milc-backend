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

// Enable CORS for all origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// ---- LOAD DATA (with no caching) ----
app.get("/data", (req, res) => {
  // Prevent browsers from caching the response
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

    // Write updated data to file
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
