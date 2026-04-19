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

    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }

    if (theme === "oled") {
      document.body.classList.add("oled-theme");
    } else {
      document.body.classList.remove("oled-theme");
    }

    if (theme === "steam") {
      document.body.classList.add("steam-theme");
    } else {
      document.body.classList.remove("steam-theme");
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
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("Light-theme");
}

if (localStorage.getItem("theme") === "oled") {
  document.body.classList.add("oled-theme");
}

if (localStorage.getItem("theme") === "discord-dark") {
  document.body.classList.add("discord-theme");
}

if (localStorage.getItem("theme") === "steam") {
  document.body.classList.add("steam-theme");
}
