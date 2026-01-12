const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve index.html

const DATA_FILE = path.join(__dirname, "events.json");

// ensure JSON file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET all events
app.get("/events", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read events" });
  }
});

// POST new event
app.post("/events", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

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
    res.status(500).json({ error: "Failed to save event" });
  }
});

app.listen(PORT, () => {
  console.log(`HGC Events backend running on port ${PORT}`);
});
