const API_URL = "https://trainer-backend.onrender.com"; 

document.addEventListener("DOMContentLoaded", () => {
    console.log("Trainer Portal Loaded");
    generateCalendar();
});

function generateCalendar() {
    console.log("Generating calendar...");
    const calendar = document.getElementById("availability-calendar");
    if (!calendar) {
        console.error("Calendar element not found");
        return;
    }

    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const today = new Date();
    const firstDay = today.getDate() - today.getDay() + 1;

    for (let week = 0; week < 4; week++) {
        let weekDiv = document.createElement("div");
        for (let i = 0; i < 7; i++) {
            let dayDiv = document.createElement("div");
            let date = new Date(today.getFullYear(), today.getMonth(), firstDay + (week * 7) + i);
            dayDiv.innerHTML = `${days[i]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            for (let hour = 8; hour < 20; hour++) {
                let slot = document.createElement("div");
                slot.textContent = `${hour}:00`;
                slot.classList.add("time-slot");
                slot.dataset.slot = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${hour}`;
                slot.onclick = () => slot.classList.toggle("available");
                dayDiv.appendChild(slot);
            }
            weekDiv.appendChild(dayDiv);
        }
        calendar.appendChild(weekDiv);
    }
}

document.getElementById("saveAvailability").addEventListener("click", async () => {
    console.log("Saving trainer availability...");
    let slots = document.querySelectorAll(".time-slot.available");
    let availability = {};
    slots.forEach(slot => {
        availability[slot.dataset.slot] = true;
    });

    try {
        await fetch(`${API_URL}/saveAvailability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availability })
        });
        console.log("Availability saved successfully!");
    } catch (error) {
        console.error("Error saving availability:", error);
    }
});
