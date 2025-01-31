const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// ✅ MUST specify your exact domain
app.use(cors({
  origin: "https://powerboxing.fun",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.post("/saveAvailability", (req, res) => {
  console.log("Received availability:", req.body);
  res.json({ message: "Availability saved successfully!" });
});

app.get("/", (req, res) => {
  res.send("Backend is running fine!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
