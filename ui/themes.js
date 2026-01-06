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

    if (theme === "ash") {
      document.body.classList.add("ash-theme");
    } else {
      document.body.classList.remove("ash-theme");
    }

   if (theme === "basalt") {
      document.body.classList.add("basalt-theme");
    } else {
      document.body.classList.remove("basalt-theme");
    }

    if (theme === "limestone") {
      document.body.classList.add("limestone-theme");
    } else {
      document.body.classList.remove("limestone-theme");
    }

    if (theme === "ember") {
      document.body.classList.add("ember-theme");
    } else {
      document.body.classList.remove("ember-theme");
    }

     if (theme === "sand") {
      document.body.classList.add("sand-theme");
    } else {
      document.body.classList.remove("sand-theme");
    }

    if (theme === "rust") {
      document.body.classList.add("rust-theme");
    } else {
      document.body.classList.remove("rust-theme");
    }

    if (theme === "clay") {
      document.body.classList.add("clay-theme");
    } else {
      document.body.classList.remove("clay-theme");
    }
     
    // Legacy Themes
    if (theme === "alt") {
      document.body.classList.add("alt-theme");
    } else {
      document.body.classList.remove("alt-theme");
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
if (localStorage.getItem("theme") === "ash") {
  document.body.classList.add("ash-theme");
}

if (localStorage.getItem("theme") === "basalt") {
  document.body.classList.add("basalt-theme");
}

if (localStorage.getItem("theme") === "limestone") {
  document.body.classList.add("limestone-theme");
}

if (localStorage.getItem("theme") === "ember") {
  document.body.classList.add("ember-theme");
}

if (localStorage.getItem("theme") === "sand") {
  document.body.classList.add("sand-theme");
}

if (localStorage.getItem("theme") === "rust") {
  document.body.classList.add("rust-theme");
}

if (localStorage.getItem("theme") === "clay") {
  document.body.classList.add("clay-theme");
}

// Legacy Themes
if (localStorage.getItem("theme") === "alt") {
  document.body.classList.add("alt-theme");
}

if (localStorage.getItem("theme") === "discord-dark") {
  document.body.classList.add("discord-theme");
}
