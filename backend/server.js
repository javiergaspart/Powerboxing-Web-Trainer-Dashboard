const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema
const AvailabilitySchema = new mongoose.Schema({
    trainerId: String,
    availableSlots: [String]
});

const Availability = mongoose.model('Availability', AvailabilitySchema);

// API to save trainer availability
app.post('/api/saveAvailability', async (req, res) => {
    const { trainerId, availableSlots } = req.body;

    try {
        await Availability.findOneAndUpdate(
            { trainerId },
            { availableSlots },
            { upsert: true }
        );
        res.json({ message: 'Availability saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving availability' });
    }
});

// API to get trainer availability
app.get('/api/getAvailability/:trainerId', async (req, res) => {
    try {
        const availability = await Availability.findOne({ trainerId: req.params.trainerId });
        res.json(availability || { availableSlots: [] });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving availability' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
