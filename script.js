const emissionFactors = {
  electricity: 0.70,
  transport: 0.12,
  fuel: 2.31,
  paper: 1.30,
  waste: 0.50
};

function getInputValue(id) {
  const input = document.getElementById(id);
  if (!input) return 0;

  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function formatEmission(value) {
  return `${value.toFixed(2)} kg CO₂e`;
}

function calculateCarbon() {
  let total = 0;

  Object.keys(emissionFactors).forEach(category => {
    const emission = getInputValue(category) * emissionFactors[category];
    total += emission;

    const result = document.getElementById(`${category}Result`);
    if (result) result.textContent = formatEmission(emission);
  });

  const totalElement = document.getElementById("totalEmission");
  if (totalElement) totalElement.textContent = formatEmission(total);

  const preview = document.getElementById("heroPreview");
  if (preview) preview.textContent = total.toFixed(2);

  const message = document.getElementById("calculation-message");
  if (message) {
    message.textContent = total > 0
      ? "Estimate updated successfully."
      : "Enter activity data above to calculate your estimate.";
  }

  return total;
}

function clearData() {
  Object.keys(emissionFactors).forEach(category => {
    const input = document.getElementById(category);
    if (input) input.value = "";
  });

  calculateCarbon();

  const message = document.getElementById("calculation-message");
  if (message) {
    message.textContent = "Inputs cleared. Enter new activity data when ready.";
  }
}

function showSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  document.querySelectorAll("main .section").forEach(section => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll(".nav-button").forEach(button => {
    const active = button.getAttribute("onclick") ===
      `showSection('${sectionId}')`;

    button.classList.toggle("active", active);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#calculator input[type='number']").forEach(input => {
    input.addEventListener("input", () => {
      const value = Number.parseFloat(input.value);

      if (input.value !== "" && (!Number.isFinite(value) || value < 0)) {
        input.setCustomValidity("Please enter a non-negative number.");
      } else {
        input.setCustomValidity("");
      }

      calculateCarbon();
    });
  });

  calculateCarbon();
});
