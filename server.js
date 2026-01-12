// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// ---------- Middleware ----------
app.use(cors());             // Allow cross-origin requests
app.use(express.json());     // Parse JSON body
app.use(express.static("public")); // Serve frontend files from public folder

// ---------- JSON storage ----------
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "events.json");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Ensure JSON file exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

// ---------- Health check ----------
app.get("/api", (req, res) => res.send("HGC Events API is running 🌿"));

// ---------- GET events ----------
app.get("/events", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("GET /events error:", err);
    res.status(500).json({ error: "Failed to read events" });
  }
});

// ---------- POST new event ----------
app.post("/events", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    const newEvent = {
      id: Date.now(),
      title: req.body.title || "",
      date: req.body.date || "",
      location: req.body.location || "",
      description: req.body.description || "",
      url: req.body.url || "",
      approved: true
    };

    events.push(newEvent);
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));

    console.log("New event added:", newEvent);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("POST /events error:", err);
    res.status(500).json({ error: "Failed to save event" });
  }
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`HGC Events backend running on port ${PORT}`);
});
