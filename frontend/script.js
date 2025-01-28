const correctUsername = "trainer";
const correctPassword = "password";

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === correctUsername && password === correctPassword) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        fetchAvailability();
        fetchSessions();
    } else {
        alert('Invalid username or password');
    }
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
}

// Fetch trainer availability from MongoDB
async function fetchAvailability() {
    try {
        const response = await fetch('http://localhost:3000/api/availability');
        const data = await response.json();
        document.querySelectorAll('.time-slot').forEach(slot => {
            if (data[slot.dataset.slot]) {
                slot.classList.add('available');
            }
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
    }
}

// Save availability to MongoDB
async function saveAvailability() {
    const slots = document.querySelectorAll('.time-slot');
    let availability = {};
    slots.forEach(slot => {
        availability[slot.dataset.slot] = slot.classList.contains('available');
    });

    try {
        const response = await fetch('http://localhost:3000/api/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(availability)
        });

        if (response.ok) {
            alert('Availability saved successfully!');
        } else {
            alert('Error saving availability');
        }
    } catch (error) {
        console.error('Error saving availability:', error);
    }
}

// Fetch sessions from MongoDB
async function fetchSessions() {
    try {
        const response = await fetch('http://localhost:3000/api/sessions');
        const sessions = await response.json();
        const sessionList = document.getElementById('session-list');
        sessionList.innerHTML = '';

        if (sessions.length === 0) {
            sessionList.innerHTML = '<p>No available sessions found.</p>';
            return;
        }

        sessions.forEach(session => {
            let btn = document.createElement('button');
            btn.textContent = `Session at ${session.date} ${session.time}`;
            btn.onclick = () => selectSession(session);
            sessionList.appendChild(btn);
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }
}

// Select session and load participants
function selectSession(session) {
    document.querySelectorAll('#session-list button').forEach(btn => {
        btn.style.backgroundColor = '';
    });

    const selectedButton = [...document.querySelectorAll('#session-list button')].find(btn => btn.textContent.includes(session.time));
    if (selectedButton) {
        selectedButton.style.backgroundColor = 'orange';
    }

    const participantList = document.getElementById('participant-list');
    participantList.innerHTML = '';

    session.participants.forEach(participant => {
        let li = document.createElement('li');
        li.textContent = participant;
        li.draggable = true;
        li.ondragstart = dragStart;
        participantList.appendChild(li);
    });

    sessionStorage.setItem('currentSession', JSON.stringify(session));
}

// Dragging participant to station
function dragStart(event) {
    event.dataTransfer.setData('text', event.target.textContent);
}

// Dropping participant onto station
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const stationNumber = event.target.getAttribute('data-id');
    if (!event.target.classList.contains('assigned')) {
        event.target.textContent = `Station ${stationNumber}: ${data}`;
        event.target.classList.add('assigned');
        event.target.style.backgroundColor = 'green';
        removeParticipant(data);
    }
}

// Remove participant from the list after assignment
function removeParticipant(name) {
    const participants = document.querySelectorAll('#participant-list li');
    participants.forEach(participant => {
        if (participant.textContent === name) {
            participant.remove();
        }
    });
}

// Save session assignments
async function startSession() {
    const sessionData = {};
    document.querySelectorAll('.station.assigned').forEach(station => {
        sessionData[`Station ${station.dataset.id}`] = station.textContent;
    });

    const currentSession = JSON.parse(sessionStorage.getItem('currentSession'));
    currentSession.assignments = sessionData;

    try {
        const response = await fetch('http://localhost:3000/api/sessions/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSession)
        });

        if (response.ok) {
            alert('Session updated successfully!');
        } else {
            alert('Error updating session');
        }
    } catch (error) {
        console.error('Error updating session:', error);
    }
}

// Make stations droppable
document.querySelectorAll('#stations .station').forEach(station => {
    station.ondragover = (event) => event.preventDefault();
    station.ondrop = drop;
});

// Load sessions on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchAvailability();
    fetchSessions();
});
