const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Trainer Availability Schema
const TrainerAvailabilitySchema = new mongoose.Schema({
    trainerId: String,
    date: String,
    slots: Array
});

const TrainerAvailability = mongoose.model('TrainerAvailability', TrainerAvailabilitySchema);

// Save Trainer Availability
app.post('/saveAvailability', async (req, res) => {
    try {
        const { trainerId, date, slots } = req.body;

        let availability = await TrainerAvailability.findOne({ trainerId, date });

        if (availability) {
            availability.slots = slots;
            await availability.save();
        } else {
            await TrainerAvailability.create({ trainerId, date, slots });
        }

        res.json({ success: true, message: 'Availability saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Fetch Trainer Availability
app.get('/getAvailability/:trainerId', async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        const availability = await TrainerAvailability.find({ trainerId });
        res.json({ success: true, availability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
