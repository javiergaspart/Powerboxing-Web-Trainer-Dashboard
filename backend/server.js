const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CRUCIAL: EXACT CORS config
app.use(cors({
  origin: "https://powerboxing.fun",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// Test route
app.get("/", (req, res) => {
  res.send("✅ Trainer Backend is running with correct CORS!");
});

// Save Availability
app.post("/saveAvailability", (req, res) => {
  console.log("Got availability:", req.body);
  // Normally store in MongoDB
  res.json({ message: "Availability saved successfully!" });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
