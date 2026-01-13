const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/test", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    events.push({
      id: "TEST",
      title: "Test Event",
      date: "2099-01-01"
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
    res.send("events.json is writable ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("events.json is NOT writable ❌");
  }
});

// Serve static front-end files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(cors());
app.use(express.json());

// JSON storage
const DATA_FILE = path.join(__dirname, "data", "events.json");

// Ensure JSON file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ----------- API Routes -----------

// Health check
app.get("/api", (req, res) => res.send("HGC Events API is running 🌿"));

// Get all events
app.get("/events", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to read events" });
  }
});

// Add new event
app.post("/events", (req, res) => {
  console.log("📥 POST /events hit");
  console.log("📦 Body received:", req.body);

  try {
    const events = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

    const newEvent = {
      id: Date.now(),
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description || "",
      url: req.body.url || "",
      approved: true
    };

    events.push(newEvent);
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("❌ Save failed:", err);
    res.status(500).json({ error: "Failed to save event" });
  }
});

// Start server
app.listen(PORT, () => console.log("📥 Incoming event:", req.body);
