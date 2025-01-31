const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Enable CORS for the frontend
const corsOptions = {
    origin: "https://powerboxing.fun", // Ensure this is the correct frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "your-mongodb-connection-string";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Trainer Availability Schema
const trainerAvailabilitySchema = new mongoose.Schema({
    trainerId: String,
    availability: Array,
    updatedAt: { type: Date, default: Date.now }
});

const TrainerAvailability = mongoose.model("TrainerAvailability", trainerAvailabilitySchema);

// ✅ Health Check Endpoint
app.get("/api/status", (req, res) => {
    res.json({ status: "ok" });
});

// ✅ Save Trainer Availability
app.post("/saveAvailability", async (req, res) => {
    try {
        const { trainerId, availability } = req.body;
        if (!trainerId || !availability) {
            return res.status(400).json({ error: "Trainer ID and availability are required." });
        }

        // Save or update availability in MongoDB
        const result = await TrainerAvailability.findOneAndUpdate(
            { trainerId },
            { availability, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        console.log("✅ Availability updated:", result);
        res.json({ success: true, message: "Availability saved successfully!", data: result });
    } catch (error) {
        console.error("❌ Error saving availability:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get Trainer Availability
app.get("/getAvailability/:trainerId", async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        const availability = await TrainerAvailability.findOne({ trainerId });

        if (!availability) {
            return res.status(404).json({ error: "No availability found for this trainer." });
        }

        res.json(availability);
    } catch (error) {
        console.error("❌ Error fetching availability:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
