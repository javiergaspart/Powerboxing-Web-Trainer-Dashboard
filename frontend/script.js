const API_URL = "https://trainer-backend.onrender.com"; // Ensure this is correct

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

async function saveAvailability() {
    console.log("Saving trainer availability...");
    const slots = document.querySelectorAll('.time-slot');
    let availability = {};
    slots.forEach(slot => {
        availability[slot.dataset.slot] = slot.classList.contains('available');
    });

    try {
        await fetch(`${API_URL}/saveAvailability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availability })
        });
        alert("Availability saved successfully!");
    } catch (error) {
        console.error("Error saving availability:", error);
    }
}

async function loadAvailability() {
    try {
        const response = await fetch(`${API_URL}/getAvailability`);
        const data = await response.json();
        document.querySelectorAll('.time-slot').forEach(slot => {
            if (data.availability[slot.dataset.slot]) {
                slot.classList.add('available');
            }
        });
    } catch (error) {
        console.error("Error loading availability:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById('availability-calendar');
    if (!calendar) {
        console.error("Calendar element not found!");
        return;
    }

    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const today = new Date();
    const firstDay = today.getDate() - today.getDay() + 1;

    for (let week = 0; week < 4; week++) {
        let weekDiv = document.createElement('div');
        weekDiv.classList.add('week-block');

        for (let i = 0; i < 7; i++) {
            let dayColumn = document.createElement('div');
            let date = new Date(today.getFullYear(), today.getMonth(), firstDay + (week * 7) + i);
            dayColumn.classList.add('day-column');
            dayColumn.innerHTML = `<div class="day-header">${days[i]} ${date.getDate()}/${date.getMonth() + 1}</div>`;

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

    loadAvailability();
});
