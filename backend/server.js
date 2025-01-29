const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = 'mongodb+srv://fitboxing_admin:Powerboxing123@cluster0.nrz2j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(mongoUri);
let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('powerboxing');
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
}

connectToDatabase();

// Save Trainer Availability
app.post('/trainer/availability', async (req, res) => {
    const { trainerId, availability } = req.body;
    try {
        await db.collection('trainer_availability').updateOne(
            { trainer_id: trainerId },
            { $set: { availability } },
            { upsert: true }
        );
        res.status(200).json({ message: '✅ Availability saved!' });
    } catch (err) {
        res.status(500).json({ error: '❌ Failed to save availability', details: err });
    }
});

// Get Trainer Availability
app.get('/trainer/availability', async (req, res) => {
    const { trainerId } = req.query;
    try {
        const trainer = await db.collection('trainer_availability').findOne({ trainer_id: trainerId });
        res.status(200).json(trainer ? trainer.availability : {});
    } catch (err) {
        res.status(500).json({ error: '❌ Failed to fetch availability', details: err });
    }
});

// Fetch Today's Sessions
app.get('/trainer/sessions', async (req, res) => {
    const { trainerId, date } = req.query;
    try {
        const sessions = await db.collection('sessions').find({ trainer_id: trainerId, date }).toArray();
        res.status(200).json(sessions);
    } catch (err) {
        res.status(500).json({ error: '❌ Failed to fetch sessions', details: err });
    }
});

// Save Session Assignments
app.post('/trainer/sessions', async (req, res) => {
    const { sessionId, assignments } = req.body;
    try {
        await db.collection('sessions').updateOne(
            { session_id: sessionId },
            { $set: { assignments } },
            { upsert: true }
        );
        res.status(200).json({ message: '✅ Session assignments saved!' });
    } catch (err) {
        res.status(500).json({ error: '❌ Failed to save session assignments', details: err });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
