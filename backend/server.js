const express = require("express");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// ✅ This part is critical
app.use(cors({
  origin: "https://powerboxing.fun",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Trainer Backend is running!");
});

// Save Availability route
app.post("/saveAvailability", (req, res) => {
  console.log("Got availability:", req.body);
  // Here is where you'd actually store in MongoDB
  res.json({ message: "Availability saved successfully!" });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
