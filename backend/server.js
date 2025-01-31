require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()); // Enable JSON body parsing

// ✅ Enable CORS for your frontend domain
app.use(cors({
    origin: "https://powerboxing.fun", // Allow frontend domain
    methods: ["GET", "POST"],
    credentials: true
}));

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || "your-mongodb-uri-here";
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Trainer Schema & Model
const trainerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Trainer = mongoose.model("Trainer", trainerSchema);

// ✅ Trainer Signup Route (Create New Trainer)
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingTrainer = await Trainer.findOne({ username });
        if (existingTrainer) {
            return res.status(400).json({ message: "Trainer already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTrainer = new Trainer({ username, password: hashedPassword });
        await newTrainer.save();

        res.status(201).json({ message: "Trainer created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Trainer Login Route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const trainer = await Trainer.findOne({ username });
        if (!trainer) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, trainer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT Token (optional)
        const token = jwt.sign({ id: trainer._id, username: trainer.username }, "your-secret-key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
