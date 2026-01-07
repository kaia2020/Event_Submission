const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // allows cross-origin requests from Shopify page
app.use(express.json());

// Path to JSON file
const EVENTS_FILE = path.join(__dirname, 'events.json');

// Helper: read JSON file
function readEvents() {
  if (!fs.existsSync(EVENTS_FILE)) return [];
  const data = fs.readFileSync(EVENTS_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Error parsing events.json:', err);
    return [];
  }
}

// Helper: write JSON file
function writeEvents(events) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
}

// GET all approved events
app.get('/events', (req, res) => {
  const events = readEvents().filter(e => e.approved);
  res.json(events);
});

// POST a new event submission
app.post('/events', (req, res) => {
  const { title, date, location, description = '', url = '', approved = false } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ error: 'Missing required fields: title, date, location' });
  }

  const events = readEvents();

  // Prevent duplicate submission (same title + date)
  const duplicate = events.find(e => e.title === title && e.date === date);
  if (duplicate) {
    return res.status(409).json({ error: 'Duplicate event detected' });
  }

  const newEvent = { title, date, location, description, url, approved };
  events.push(newEvent);
  writeEvents(events);

  res.status(201).json({ message: 'Event submitted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`HGC Events backend running on port ${PORT}`);
});
