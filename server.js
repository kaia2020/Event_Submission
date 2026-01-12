const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- JSON storage ----------
const DATA_FILE = path.join(__dirname, "events.json");

// Ensure JSON file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ---------- Root health check ----------
app.get("/", (req, res) => {
  res.send("HGC Events API is running 🌿");
});

// ---------- GET events ----------
app.get("/events", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read events" });
  }
});

// ---------- POST new event ----------
app.post("/events", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    const newEvent = {
      id: Date.now(),
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description || "",
      url: req.body.url || "",
      approved: true // auto-approved for now
    };

    events.push(newEvent);
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: "Failed to save event" });
  }
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`HGC Events backend running on port ${PORT}`);
});
