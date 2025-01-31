const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// ✅ Fix CORS issue to allow frontend requests
app.use(cors({
    origin: "https://powerboxing.fun",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// ✅ Save Availability Endpoint (Ensure it exists)
app.post("/saveAvailability", (req, res) => {
    console.log("Received availability:", req.body);
    res.json({ message: "Availability saved successfully!" });
});

// ✅ Health Check Endpoint
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
