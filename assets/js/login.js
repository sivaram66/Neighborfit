// login.js
// Only handles UI features (e.g., show/hide password). Does NOT handle authentication!

document.addEventListener("DOMContentLoaded", function () {
  // Password toggle functionality
  const passwordToggle = document.querySelector(".password-toggle");
  if (passwordToggle) {
    passwordToggle.addEventListener("click", function (e) {
      const targetId = passwordToggle.dataset.target;
      const input = document.getElementById(targetId);
      const toggleText = passwordToggle.querySelector(".toggle-text");
      if (input.type === "password") {
        input.type = "text";
        toggleText.textContent = "Hide";
      } else {
        input.type = "password";
        toggleText.textContent = "Show";
      }
    });
  }

  // Optionally, you can add similar UI-only features here (e.g., show/hide confirm password)
});
