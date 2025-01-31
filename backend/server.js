const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
    origin: "https://powerboxing.fun", // Allow frontend requests
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model("User", UserSchema);

// 🔹 Login Route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (user) {
            res.status(200).json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 🔹 Save Trainer Availability Route
app.post("/saveAvailability", async (req, res) => {
    try {
        console.log("Received availability:", req.body);
        res.status(200).json({ success: true, message: "Availability saved" });
    } catch (error) {
        console.error("Error saving availability:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Default Route
app.get("/", (req, res) => {
    res.send("Trainer Backend is Running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
