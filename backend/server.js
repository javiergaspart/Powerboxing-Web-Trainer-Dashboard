const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// IMPORTANT: This EXACT config is needed
app.use(cors({
  origin: "https://powerboxing.fun",  // <== EXACT domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Trainer Backend is running with correct CORS!");
});

// SAVE AVAILABILITY
app.post("/saveAvailability", (req, res) => {
  console.log("Received availability data:", req.body);
  // Here you would store data in MongoDB; for now, just send success:
  res.json({ message: "Availability saved successfully!" });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
