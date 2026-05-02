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

app.use(cors());
app.use(express.json());

// Load data
app.get("/data", (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const json = JSON.parse(raw || "{}");
    res.json(json);
  } catch (err) {
    console.error("Error reading data.json:", err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

// Save data
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

app.get("/", (req, res) => {
  res.send("MILC backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
