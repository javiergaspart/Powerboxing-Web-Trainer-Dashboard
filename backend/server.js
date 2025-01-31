const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration: Allow frontend (Trainer Portal) to access backend
const corsOptions = {
  origin: "https://powerboxing.fun", // ✅ Set to your frontend domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware for JSON parsing

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ MongoDB Schema for Trainer Availability
const trainerAvailabilitySchema = new mongoose.Schema({
  trainerId: String,
  availability: Object // Store availability slots in an object
});
const TrainerAvailability = mongoose.model("TrainerAvailability", trainerAvailabilitySchema);

// ✅ Route: Save Trainer Availability
app.post("/saveAvailability", async (req, res) => {
  try {
    console.log("📥 Received Trainer Availability Data:", req.body);
    const { trainerId, availability } = req.body;

    await TrainerAvailability.findOneAndUpdate(
      { trainerId },
      { availability },
      { upsert: true, new: true }
    );

    console.log("✅ Availability Saved Successfully");
    res.status(200).json({ message: "Availability saved successfully" });
  } catch (error) {
    console.error("❌ Error saving availability:", error);
    res.status(500).json({ error: "Failed to save availability" });
  }
});

// ✅ Route: Get Trainer Availability
app.get("/getAvailability", async (req, res) => {
  try {
    const trainerId = req.query.trainerId;
    const trainerData = await TrainerAvailability.findOne({ trainerId });

    if (!trainerData) {
      return res.status(404).json({ error: "No availability found" });
    }

    console.log("✅ Sending Trainer Availability Data");
    res.json(trainerData);
  } catch (error) {
    console.error("❌ Error fetching availability:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

// ✅ Route: Default API Response
app.get("/", (req, res) => {
  res.send("PowerBoxing Trainer API is running ✅");
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
