document.addEventListener("DOMContentLoaded", function () {
  // Amenities preview
  const amenitiesCheckboxes = document.querySelectorAll(
    'input[name="amenities"]'
  );
  const amenitiesPreview = document.getElementById("amenitiesPreview");

  amenitiesCheckboxes.forEach((cb) => {
    cb.addEventListener("change", function () {
      let selected = [];
      amenitiesCheckboxes.forEach((cb) => {
        if (cb.checked) selected.push(cb.value);
      });
      if (amenitiesPreview) {
        amenitiesPreview.textContent = selected.length
          ? selected.join(", ")
          : "None selected";
      }
    });
  });

  // City and Area preview
  const citySelect = document.getElementById("city-select");
  const areaSelect = document.getElementById("area-select");
  const cityPreview = document.getElementById("cityPreview");
  const areaPreview = document.getElementById("areaPreview");

  if (citySelect && cityPreview) {
    citySelect.addEventListener("change", function () {
      cityPreview.textContent =
        citySelect.options[citySelect.selectedIndex].text || "No city selected";
    });
  }
  if (areaSelect && areaPreview) {
    areaSelect.addEventListener("change", function () {
      areaPreview.textContent =
        areaSelect.options[areaSelect.selectedIndex].text || "No area selected";
    });
  }

  // Property type preview
  const propertyRadios = document.querySelectorAll('input[name="house_type"]');
  const propertyPreview = document.getElementById("propertyTypePreview");

  propertyRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (propertyPreview) {
        const selected = document.querySelector(
          'input[name="house_type"]:checked'
        );
        propertyPreview.textContent = selected
          ? selected.value
          : "No type selected";
      }
    });
  });

  // Budget preview
  const budgetSelect = document.getElementById("budget-range");
  const budgetPreview = document.getElementById("budgetPreview");
  if (budgetSelect && budgetPreview) {
    budgetSelect.addEventListener("change", function () {
      budgetPreview.textContent =
        budgetSelect.options[budgetSelect.selectedIndex].text ||
        "No budget selected";
    });
  }

  // Pet information preview
  const petRadios = document.querySelectorAll('input[name="pets"]');
  const petPreview = document.getElementById("petPreview");
  petRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (petPreview) {
        const selected = document.querySelector('input[name="pets"]:checked');
        petPreview.textContent = selected
          ? selected.nextElementSibling.textContent
          : "No pet info";
      }
    });
  });

  // You can add more UI enhancements below as needed
});
