// Select all inputs and the form
const inputs = document.querySelectorAll(".input");
const form = document.querySelector("form");

// Add focus/blur styling for floating labels
function focusFunc() {
  const parent = this.closest(".input-container");
  parent.classList.add("focus");
}

function blurFunc() {
  const parent = this.closest(".input-container");
  if (this.value.trim() === "") {
    parent.classList.remove("focus");
  }
}

// Attach focus/blur events
inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});



// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;
  let formdata = {};

  // Validate and collect data
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      valid = false;
      input.closest(".input-container").classList.remove("focus");
    } else {
      formdata[input.name] = input.value.trim();
    }
  });

  if (!valid) {
    alert("⚠️ Please fill all fields correctly before submitting.");
    return;
  }

  // Save to localStorage
  localStorage.setItem("formdata", JSON.stringify(formdata));

  alert("✅ Data Saved Successfully!");
  form.reset();

  // Remove focus class after reset
  inputs.forEach((input) => {
    input.closest(".input-container").classList.remove("focus");
  });
});