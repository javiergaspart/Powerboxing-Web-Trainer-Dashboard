require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ ENABLE CORS PERMANENTLY
app.use(
    cors({
        origin: "*", // Allows all origins
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type,Authorization"
    })
);

app.use(express.json());

// ✅ CONNECT TO MONGODB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ TRAINER SCHEMA & MODEL
const trainerSchema = new mongoose.Schema({
    username: String,
    password: String,
    availability: Array
});

const Trainer = mongoose.model("Trainer", trainerSchema);

// ✅ LOGIN ROUTE
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const trainer = await Trainer.findOne({ username, password });
        if (trainer) {
            res.json({ success: true, message: "Login successful!", trainer });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ✅ SAVE TRAINER AVAILABILITY
app.post("/saveAvailability", async (req, res) => {
    const { username, availability } = req.body;

    try {
        const trainer = await Trainer.findOneAndUpdate(
            { username },
            { availability },
            { new: true, upsert: true }
        );
        res.json({ success: true, message: "Availability updated!", trainer });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ✅ START SERVER
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
