const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ✅ This is the CRUCIAL PART:
app.use(cors({
    origin: "https://powerboxing.fun", // EXACT domain of your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Sample route to confirm
app.post("/saveAvailability", (req, res) => {
    console.log("Got availability data:", req.body);
    res.json({ message: "Availability saved successfully!" });
});

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
