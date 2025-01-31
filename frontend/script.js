const API_URL = "https://trainer-backend.onrender.com"; // Ensure this is your actual backend URL

// ✅ Function: Load Trainer Availability from MongoDB
async function loadAvailability() {
    console.log("🔄 Loading trainer availability...");

    try {
        const response = await fetch(`${API_URL}/getAvailability?trainerId=123`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Loaded Availability Data:", data);

        document.querySelectorAll(".time-slot").forEach(slot => {
            if (data.availability && data.availability[slot.dataset.slot]) {
                slot.classList.add("available");
            }
        });

        console.log("✅ Availability loaded successfully.");
    } catch (error) {
        console.error("❌ Error loading availability:", error);
    }
}

// ✅ Function: Save Trainer Availability to MongoDB
async function saveAvailability() {
    console.log("📤 Saving trainer availability...");

    const availability = {};
    document.querySelectorAll(".time-slot").forEach(slot => {
        availability[slot.dataset.slot] = slot.classList.contains("available");
    });

    try {
        const response = await fetch(`${API_URL}/saveAvailability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trainerId: "123", availability })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("✅ Trainer availability saved successfully.");
        alert("✅ Availability saved!");
    } catch (error) {
        console.error("❌ Error saving availability:", error);
        alert("❌ Failed to save availability.");
    }
}

// ✅ Function: Toggle Availability Slot
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Trainer Portal Loaded");
    loadAvailability(); // Call function on page load

    document.querySelectorAll(".time-slot").forEach(slot => {
        slot.addEventListener("click", () => {
            if (!slot.classList.contains("past")) {
                slot.classList.toggle("available");
            }
        });
    });

    document.getElementById("saveAvailability").addEventListener("click", saveAvailability);
});
