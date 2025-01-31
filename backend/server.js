const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS (Allow requests from your frontend)
app.use(cors({
    origin: 'https://powerboxing.fun',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Trainer Schema & Model
const trainerSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Trainer = mongoose.model('Trainer', trainerSchema);

// ✅ Trainer Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const trainer = await Trainer.findOne({ username, password });
        if (!trainer) return res.status(401).json({ error: "Invalid credentials" });

        res.json({ message: "Login successful", trainer });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
