document.addEventListener("DOMContentLoaded", function () {
  const passwordToggles = document.querySelectorAll(".password-toggle");
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      const targetId = toggle.dataset.target;
      const input = document.getElementById(targetId);
      const toggleText = toggle.querySelector(".toggle-text");
      if (input.type === "password") {
        input.type = "text";
        toggleText.textContent = "Hide";
      } else {
        input.type = "password";
        toggleText.textContent = "Show";
      }
    });
  });
  // No code here should prevent form submission!
});
