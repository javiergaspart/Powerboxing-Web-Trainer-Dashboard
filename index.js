const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://fitboxing_admin:Powerboxing123@cluster0.nrz2j.mongodb.net/fitboxing?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Session Schema
const sessionSchema = new mongoose.Schema({
    date: String,
    time: String,
    slots: { type: Number, default: 20 },
    participants: { type: [String], default: [] }
});

const Session = mongoose.model('Session', sessionSchema);

// Availability Schema
const availabilitySchema = new mongoose.Schema({
    slot: String,
    available: Boolean
});

const Availability = mongoose.model('Availability', availabilitySchema);

// Routes

// Get all available sessions
app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await Session.find({});
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error });
    }
});

// Create new session
app.post('/api/sessions', async (req, res) => {
    try {
        const { date, time } = req.body;
        const newSession = new Session({ date, time });
        await newSession.save();
        res.status(201).json({ message: 'Session created', session: newSession });
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error });
    }
});

// Update session with participants
app.post('/api/sessions/update', async (req, res) => {
    try {
        const { _id, participants } = req.body;
        await Session.findByIdAndUpdate(_id, { participants });
        res.json({ message: 'Session updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error });
    }
});

// Get availability
app.get('/api/availability', async (req, res) => {
    try {
        const availability = await Availability.find({});
        res.json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error });
    }
});

// Save availability
app.post('/api/availability', async (req, res) => {
    try {
        await Availability.deleteMany({});
        await Availability.insertMany(Object.entries(req.body).map(([slot, available]) => ({ slot, available })));
        res.json({ message: 'Availability saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving availability', error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
