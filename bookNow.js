// bookNow.js (UPDATED with proper booked vehicle display + persistence)
document.addEventListener("DOMContentLoaded", () => {
  const bookNowButtons = document.querySelectorAll(".booknow");
  const bookingForm = document.querySelector(".Booking-form");
  const closeButton = document.querySelector(".close-button");
  const overlay = document.querySelector(".overlay");

  const form = document.getElementById("booking-form");
  const inputs = form.querySelectorAll("input, select"); // all inputs + select

  const pickupDate = document.getElementById("pickup-date");
  const returnDate = document.getElementById("return-date");
  const vehicleSelect = document.getElementById("vehicle-type");

  // -------------------------
  // Open / Close modal
  // -------------------------
  function openForm() {
    bookingForm.classList.add("display");
    overlay.classList.add("display");
  }

  function closeForm() {
    bookingForm.classList.remove("display");
    overlay.classList.remove("display");
  }

  closeButton.addEventListener("click", closeForm);
  overlay.addEventListener("click", closeForm);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeForm();
  });

  // -------------------------
  // Get Vehicle Name from Card
  // -------------------------
  function getVehicleNameFromCard(cardEl) {
    const headerEl = cardEl.querySelector(".card-header");
    const subEl = cardEl.querySelector(".car-subname");

    const brand = headerEl ? headerEl.childNodes[0].textContent.trim() : "";
    const sub = subEl ? subEl.textContent.trim() : "";

    return `${brand} ${sub}`.trim();
  }

  // -------------------------
  // Check if card is already booked or not available
  // -------------------------
  function isNotAvailable(cardEl) {
    const notAvail = cardEl.querySelector(".not-available");
    return notAvail && notAvail.textContent.trim() !== "";
  }

  // -------------------------
  // Mark vehicle card as booked and remove from dropdown
  // -------------------------
  function markVehicleAsBooked(vehicleName) {
    const allCards = document.querySelectorAll(".card");

    allCards.forEach((card) => {
      const cardName = getVehicleNameFromCard(card).toLowerCase();
      if (cardName === vehicleName.toLowerCase()) {
        // Add or update 'not available' overlay
        let notAvailableDiv = card.querySelector(".not-available");
        if (!notAvailableDiv) {
          notAvailableDiv = document.createElement("div");
          notAvailableDiv.classList.add("not-available");
          card.appendChild(notAvailableDiv);
        }
        notAvailableDiv.textContent = "Booked!";
        notAvailableDiv.style.opacity = 1;
        notAvailableDiv.style.top = "20%";

        // Disable button
        const btn = card.querySelector(".booknow");
        btn.classList.add("booknow-not-available");
        btn.disabled = true;

        // Apply grayscale
        card.style.filter = "grayscale(100%)";
      }
    });

    // Remove booked vehicle from dropdown
    const optionToRemove = [...vehicleSelect.options].find(
      (o) => o.value.trim().toLowerCase() === vehicleName.toLowerCase()
    );
    if (optionToRemove) optionToRemove.remove();
  }

  // -------------------------
  // Restore booked vehicles on page load
  // -------------------------
  const bookedVehicles = JSON.parse(localStorage.getItem("bookings")) || [];
  bookedVehicles.forEach((b) => {
    markVehicleAsBooked(b["vehicle-type"]);
  });

  // -------------------------
  // Also mark vehicles that are already "Not Available At the Moment" in HTML
  // -------------------------
  document.querySelectorAll(".card").forEach((card) => {
    const notAvail = card.querySelector(".not-available");
    if (notAvail && notAvail.textContent.trim() !== "") {
      const btn = card.querySelector(".booknow");
      btn.classList.add("booknow-not-available");
      btn.disabled = true;
      card.style.filter = "grayscale(100%)";
    }
  });

  // -------------------------
  // Open form only for available vehicles + auto select vehicle
  // -------------------------
  bookNowButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("booknow-not-available")) return;

      const card = btn.closest(".card");
      if (!card || isNotAvailable(card)) return;

      const vehicleName = getVehicleNameFromCard(card);

      const option = [...vehicleSelect.options].find(
        (o) => o.value.trim().toLowerCase() === vehicleName.toLowerCase()
      );

      vehicleSelect.value = option ? option.value : "";

      openForm();
    });
  });

  // -------------------------
  // Date validation (Return >= Pickup)
  // -------------------------
  pickupDate.addEventListener("change", () => {
    returnDate.min = pickupDate.value;
    if (returnDate.value && returnDate.value < pickupDate.value) {
      returnDate.value = "";
    }
  });

  // -------------------------
  // Clear error style on typing
  // -------------------------
  inputs.forEach((input) => {
    input.addEventListener("input", () => input.classList.remove("error"));
    input.addEventListener("change", () => input.classList.remove("error"));
  });

  // -------------------------
  // Submit: validate + save to localStorage
  // -------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;
    let formdata = {};

    inputs.forEach((input) => {
      const value = input.value.trim();
      if (!value) {
        valid = false;
        input.classList.add("error");
      } else {
        formdata[input.id] = value;
      }
    });

    if (pickupDate.value && returnDate.value && returnDate.value < pickupDate.value) {
      valid = false;
      returnDate.classList.add("error");
      alert("⚠️ Return date must be same or after Pickup date.");
      return;
    }

    if (!valid) {
      alert("⚠️ Please fill all fields correctly before submitting.");
      return;
    }

    // Save booking
    const existing = JSON.parse(localStorage.getItem("bookings")) || [];
    existing.push({
      ...formdata,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("bookings", JSON.stringify(existing));

    // Mark vehicle as booked and remove from dropdown
    markVehicleAsBooked(formdata["vehicle-type"]);

    alert("✅ Booking Saved Successfully!");
    form.reset();
    returnDate.min = "";
    closeForm();
  });

  // -------------------------
  // Reset clears errors
  // -------------------------
  form.addEventListener("reset", () => {
    inputs.forEach((input) => input.classList.remove("error"));
  });
});
