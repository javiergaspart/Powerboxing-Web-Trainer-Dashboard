async function saveAvailability() {
    console.log("Saving trainer availability...");

    let slots = document.querySelectorAll(".time-slot");
    let availability = {};

    slots.forEach(slot => {
        availability[slot.textContent] = slot.classList.contains("available");
    });

    try {
        let response = await fetch("https://trainer-backend.onrender.com/saveAvailability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ availability })
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        let data = await response.json();
        console.log("✅ Availability saved successfully:", data);
    } catch (error) {
        console.error("❌ Error saving availability:", error);
    }
}

// ✅ Fix: Generate Calendar and Ensure Slots Are Clickable
function generateCalendar() {
    let calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    let days = ["M", "T", "W", "T", "F", "S", "S"];
    let today = new Date();
    let firstDay = today.getDate() - today.getDay() + 1;

    for (let week = 0; week < 4; week++) {
        let weekDiv = document.createElement("div");
        weekDiv.classList.add("week-row");

        for (let i = 0; i < 7; i++) {
            let dayColumn = document.createElement("div");
            let date = new Date(today.getFullYear(), today.getMonth(), firstDay + (week * 7) + i);

            dayColumn.innerHTML = `<strong>${days[i]} ${date.getDate()}/${date.getMonth() + 1}</strong>`;
            dayColumn.classList.add("day-column");

            for (let hour = 8; hour <= 15; hour++) {
                let slot = document.createElement("div");
                slot.classList.add("time-slot");
                slot.textContent = `${hour}:00`;

                if (date < today) {
                    slot.classList.add("past");
                    slot.style.pointerEvents = "none";
                } else {
                    slot.addEventListener("click", () => slot.classList.toggle("available"));
                }

                dayColumn.appendChild(slot);
            }

            weekDiv.appendChild(dayColumn);
        }

        calendar.appendChild(weekDiv);
    }
}
