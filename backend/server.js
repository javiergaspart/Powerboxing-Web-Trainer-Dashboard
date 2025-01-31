const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://powerboxing.fun" }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "trainer" && password === "password") {
        res.json({ token: "trainer123" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.post("/saveAvailability", (req, res) => {
    console.log("Received trainer availability:", req.body);
    res.json({ message: "Availability saved successfully!" });
});

app.listen(10000, () => {
    console.log("Server running on port 10000");
});
