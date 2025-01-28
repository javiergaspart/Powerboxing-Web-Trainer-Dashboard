const correctUsername = "trainer";
const correctPassword = "password";

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === correctUsername && password === correctPassword) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadAvailability();
        loadSessions();
    } else {
        alert('Invalid username or password');
    }
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
}

// Trainer Availability Management
function saveAvailability() {
    const slots = document.querySelectorAll('.time-slot');
    let availability = {};
    slots.forEach(slot => {
        availability[slot.dataset.slot] = slot.classList.contains('available');
    });
    localStorage.setItem('trainerAvailability', JSON.stringify(availability));
    alert('Availability saved successfully!');
}

function loadAvailability() {
    const availability = JSON.parse(localStorage.getItem('trainerAvailability')) || {};
    document.querySelectorAll('.time-slot').forEach(slot => {
        if (availability[slot.dataset.slot]) {
            slot.classList.add('available');
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById('availability-calendar');
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const today = new Date();
    const firstDay = today.getDate() - today.getDay() + 1;  // Move to Monday of the current week

    for (let week = 0; week < 8; week++) {
        let weekDiv = document.createElement('div');
        weekDiv.classList.add('week-block');

        for (let i = 0; i < 7; i++) {
            let dayColumn = document.createElement('div');
            let date = new Date(today.getFullYear(), today.getMonth(), firstDay + (week * 7) + i);
            dayColumn.classList.add('day-column');
            dayColumn.innerHTML = `<div class="day-header">${days[i]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</div>`;

            for (let hour = 8; hour <= 20; hour++) {
                let slot = document.createElement('div');
                slot.textContent = `${hour}:00`;
                slot.classList.add('time-slot', 'unavailable');
                slot.dataset.slot = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${hour}:00`;
                
                if (date < today.setHours(0, 0, 0, 0)) {
    slot.classList.add('past');
} else {
    slot.onclick = () => slot.classList.toggle('available');
                }
                dayColumn.appendChild(slot);
            }
            weekDiv.appendChild(dayColumn);
        }
        calendar.appendChild(weekDiv);
    }
});

// Load available sessions for today from stored availability
function loadSessions() {
    const today = new Date();
    const sessionList = document.getElementById('session-list');
    sessionList.innerHTML = '';

    const availableSlots = document.querySelectorAll('.time-slot.available');
    if (availableSlots.length === 0) {
        sessionList.innerHTML = '<p>No available sessions for today.</p>';
        return;
    }

    availableSlots.forEach(slot => {
        let slotDate = new Date(slot.dataset.slot);
        if (slotDate.toDateString() === today.toDateString()) {
            let btn = document.createElement('button');
            btn.textContent = `Session at ${slot.textContent}`;
            btn.onclick = () => selectSession(slot.dataset.slot);
            sessionList.appendChild(btn);
        }
    });
}
// Select session and load participants
function selectSession(slot) {
    // Reset colors of all session buttons
    document.querySelectorAll('#session-list button').forEach(btn => {
        btn.style.backgroundColor = '';
    });

    // Change the color of the selected session
    const selectedButton = [...document.querySelectorAll('#session-list button')].find(btn => btn.textContent.includes(slot.split(' ')[1]));
    if (selectedButton) {
        selectedButton.style.backgroundColor = 'orange';
    }

    const participantList = document.getElementById('participant-list');
    participantList.innerHTML = '';
    const participants = ["Participant 1", "Participant 2", "Participant 3"];

    participants.forEach(participant => {
        let li = document.createElement('li');
        li.textContent = participant;
        li.draggable = true;
        li.ondragstart = dragStart;
        participantList.appendChild(li);    });

    sessionStorage.setItem('currentSession', slot);
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

        // Remove assigned participant from list
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

// Make stations droppable
document.querySelectorAll('#stations .station').forEach(station => {
    station.ondragover = (event) => event.preventDefault();
    station.ondrop = drop;
});

// Start session and store assignments
function startSession() {
    const sessionKey = sessionStorage.getItem('currentSession');
    if (!sessionKey) {
        alert('Please select a session before starting.');
        return;
    }

    const sessionData = {};
    document.querySelectorAll('.station.assigned').forEach(station => {
        sessionData[`Station ${station.dataset.id}`] = station.textContent;
    });

    localStorage.setItem(`session-${sessionKey}`, JSON.stringify(sessionData));
    alert('Session started and saved successfully!');
}

// Load sessions on page load
document.addEventListener("DOMContentLoaded", loadSessions);