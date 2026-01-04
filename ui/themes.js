/* =====================================================
   SETTINGS
   ===================================================== */
const SettingsModal = document.getElementById("settingsModal");
const openSettings = document.getElementById("openSettingsModal");
const closeSettings = document.getElementById("closeSettingsModal");

// Open modal
openSettings.addEventListener("click", (e) => {
  e.preventDefault();
  SettingsModal.style.display = "flex";
});

// Close modal
closeSettings.addEventListener("click", () => {
  SettingsModal.style.display = "none";
});

// Click outside modal closes it
SettingsModal.addEventListener("click", (e) => {
  if (e.target === SettingsModal) SettingsModal.style.display = "none";
});

// Theme buttons
document.querySelectorAll(".theme-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;

    if (theme === "alt") {
      document.body.classList.add("alt-theme");
    } else {
      document.body.classList.remove("alt-theme");
    }
    
    if (theme === "scandi") {
      document.body.classList.add("scandi-theme");
    } else {
      document.body.classList.remove("scandi-theme");
    }

    if (theme === "discord-dark") {
      document.body.classList.add("discord-theme");
    } else {
      document.body.classList.remove("discord-theme");
    }

    localStorage.setItem("theme", theme);
  });
});

// Load saved theme
if (localStorage.getItem("theme") === "alt") {
  document.body.classList.add("alt-theme");
}

if (localStorage.getItem("theme") === "scandi") {
  document.body.classList.add("scandi-theme");
}

if (localStorage.getItem("theme") === "discord-dark") {
  document.body.classList.add("discord-theme");
}