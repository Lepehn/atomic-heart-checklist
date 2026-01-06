import { GAME } from "../game/game.js";
console.log(GAME);
/* =====================================================
   STATE
   ===================================================== */
   
let currentPlaythrough = 1;
let currentCategory = Object.keys(GAME.categories)[0];
let categoryChart;


/* =====================================================
   STORAGE
   ===================================================== */

const saved = JSON.parse(localStorage.getItem(GAME.storageKey));

if (saved?.playthroughs) {
  GAME.playthroughs = saved.playthroughs;
} 
else if (saved) {
  // 🔁 MIGRATE OLD SAVE → PT1
  GAME.playthroughs = {
    1: saved,
    2: structuredClone(GAME.data)
  };

  localStorage.setItem(
    GAME.storageKey,
    JSON.stringify({ playthroughs: GAME.playthroughs })
  );
} 
else {
  // 🆕 FIRST RUN
  GAME.playthroughs = {
    1: structuredClone(GAME.data),
    2: structuredClone(GAME.data)
  };
}

function getCurrentData() {
  return GAME.playthroughs[currentPlaythrough];
}

function saveGame() {
  localStorage.setItem(
    GAME.storageKey,
    JSON.stringify({ playthroughs: GAME.playthroughs })
  );
}


/* =====================================================
   HELPERS
   ===================================================== */

function isCompleted(status) {
  return GAME.completedStatuses.includes(status);
}

function splitTags(tag) {
  return Array.isArray(tag) ? tag : tag.split(",").map(t => t.trim());
}

function completionPercent(list) {
  const done = list.filter(q => isCompleted(q.status)).length;
  return list.length ? Math.round((done / list.length) * 100) : 0;
}


/* =====================================================
   STATS + CHART
   ===================================================== */

function updateStats() {
  const labels = [];
  const values = [];

  for (const key in GAME.categories) {
    if (!getCurrentData()[key]) continue;
    labels.push(GAME.categories[key]);
    values.push(completionPercent(getCurrentData()[key]));
  }

  const ctx = document.getElementById("categoryChart")?.getContext("2d");
  if (!ctx) return;

  const cardInlay = getComputedStyle(document.documentElement)
    .getPropertyValue("--card-inlay")
    .trim();

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-muted')
    .trim();

  Chart.defaults.color = textColor;
  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Completion %",
        data: values,
        backgroundColor: "#1177a3"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: v => v + "%" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: c => c.parsed.y + "%" }
        }
      }
    },
    plugins: [{
      beforeDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = cardInlay;
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    }]
  });
}


/* =====================================================
   TABLE + DASHBOARD RENDER
   ===================================================== */

function renderTable() {
  const tbody = document.querySelector("#questsTable tbody");

  const recentList = document.getElementById("recentlyPlayed");
  const inProgressList = document.getElementById("inProgress");
  const summaryBox = document.getElementById("summary");
  const completionText = document.getElementById("completionText");
  const completionBar = document.getElementById("completionBar");
  const completionTextStats = document.getElementById("completionTextStats");
  const completionBarStats = document.getElementById("completionBarStats");

  recentList.innerHTML = "";
  inProgressList.innerHTML = "";

  let totalQuests = 0, completed = 0, inProgress = 0, notStarted = 0, onHold = 0, hundred = 0;

  const recentFrag = document.createDocumentFragment();
  const inProgressFrag = document.createDocumentFragment();

  tbody.innerHTML = getCurrentData()[currentCategory].map((q, i) => {
    const tags = splitTags(q.tag);

    return `
      <tr>
        <td>
          <div>${q.name}</div>
          ${q.note ? `<div class="note">${q.note}</div>` : ""}
        </td>
        <td>${GAME.categories[currentCategory]}</td>
        <td>
          <div class="tag-container">
            ${tags.map(t => `<span class="tag ${t.replace(/\s+/g, "-")}">${t}</span>`).join("")}
          </div>
        </td>
        <td>
          <select class="statusSelect status${q.status}" data-index="${i}">
            ${GAME.statuses.map(s =>
              `<option value="${s}" ${q.status === s ? "selected" : ""}>
                ${s === "Hundred" ? "100%" : s.replace(/([A-Z])/g, " $1").trim()}
              </option>`
            ).join("")}
          </select>
        </td>
      </tr>
    `;
  }).join("");

  getCurrentData()[currentCategory].forEach(q => {
    totalQuests++;

    switch (q.status) {
      case "Completed": completed++; recentFrag.appendChild(li(q.name)); break;
      case "Hundred": hundred++; completed++; recentFrag.appendChild(li(q.name + " (100%)")); break;
      case "InProgress": inProgress++; inProgressFrag.appendChild(li(q.name)); break;
      case "NotStarted": notStarted++; break;
      case "OnHold": onHold++; break;
    }
  });

  recentList.appendChild(recentFrag);
  inProgressList.appendChild(inProgressFrag);

  let total = 0, done = 0;
  Object.values(getCurrentData()).forEach(cat =>
    cat.forEach(q => { total++; if (isCompleted(q.status)) done++; })
  );

  const percent = total ? (done / total) * 100 : 0;

  if (completionBar) completionBar.style.width = percent + "%";
  if (completionText) completionText.textContent = `${done} / ${total} Completed`;
  if (completionBarStats) completionBarStats.style.width = percent + "%";
  if (completionTextStats) completionTextStats.textContent = `${done} / ${total} Completed`;

  if (summaryBox) {
    summaryBox.innerHTML = `
      <li>Total: ${totalQuests}</li>
      <li>100%: ${hundred}</li>
      <li>Completed: ${completed}</li>
      <li>In Progress: ${inProgress}</li>
      <li>Not Started: ${notStarted}</li>
      <li>On Hold: ${onHold}</li>
    `;
  }

  applyFilters();
}

function li(text) {
  const el = document.createElement("li");
  el.textContent = text;
  return el;
}


/* =====================================================
   EVENTS
   ===================================================== */

document.addEventListener("change", e => {
  if (!e.target.matches(".statusSelect")) return;

  const index = e.target.dataset.index;
  getCurrentData()[currentCategory][index].status = e.target.value;

  saveGame();
  renderTable();
});

// Playthough handler
document.querySelectorAll(".playthrough-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".playthrough-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    currentPlaythrough = Number(btn.dataset.pt);

    renderTable();
    updateStats();
  });
});

const searchInput = document.getElementById("gameSearch");
searchInput.addEventListener("input", applyFilters);

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const tbody = document.querySelector('#questsTable tbody');

  Array.from(tbody.querySelectorAll('tr')).forEach(row => {
    const title = row.cells[0]?.textContent.toLowerCase() || '';
    const tags  = row.cells[2]?.textContent.toLowerCase() || '';

    const statusSelect = row.cells[3]?.querySelector('select');
    const statusVal = (statusSelect?.value || '').toLowerCase();

    // Map value to human-readable label
    let statusLabel = statusVal;
    if (statusVal === 'hundred')     statusLabel = '100%';
    if (statusVal === 'inprogress')  statusLabel = 'in progress';
    if (statusVal === 'notstarted')  statusLabel = 'not started';
    if (statusVal === 'onhold')      statusLabel = 'on hold';

    const match =
      !query ||
      title.includes(query) ||
      statusVal.includes(query) ||
      statusLabel.includes(query) ||
      tags.includes(query);

    row.style.display = match ? '' : 'none';
  });
}

document.querySelectorAll(".button-report[data-cat]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.cat;
    renderTable();
  });
});


/* =====================================================
   TABS
   ===================================================== */

const dashboardContent = document.getElementById("dashboardContent");
const statsContent = document.getElementById("statsContent");

document.querySelectorAll(".navbar .menu a").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".navbar .menu a")
    .forEach(link => link.classList.remove("active"));
    a.classList.add("active");
    const isStats = a.textContent.trim() === "Stats";
    dashboardContent.style.display = isStats ? "none" : "block";
    statsContent.style.display = isStats ? "block" : "none";
    if (isStats) updateStats();
  });
});


/* =====================================================
   Export/Import
   ===================================================== */
document.getElementById("exportBtn").addEventListener("click", () => {
  const saveData = {
    id: GAME.id,
    version: 2,
    playthroughs: GAME.playthroughs
  };

  const blob = new Blob(
    [JSON.stringify(saveData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${GAME.id}-checklist-save.json`;
  a.click();

  URL.revokeObjectURL(url);
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importJSON").click();
});

document.getElementById("importJSON").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);

      // 🔒 Verify game ID
      if (imported.id !== GAME.id) {
        throw new Error("This save file does not belong to this game");
      }
      
      let playthroughs;

      // NEW MULTI-PT FORMAT
      if (imported.playthroughs) {
        playthroughs = imported.playthroughs;
      }
      // OLD FORMAT → MIGRATE TO PT1
      else {
        playthroughs = {
          1: imported,
          2: structuredClone(GAME.data)
        };
      }

      // UNIVERSAL STRICT NAME VALIDATION (allow extra fields)
      const validateNames = (obj) => {
        if (Array.isArray(obj)) {
          if (obj.length === 0) return false;
          return obj.every(item => validateNames(item));
        } else if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          return "name" in obj;
        }
        return false;
      };

      // Recursively check each array in playthroughs
      const checkPlaythroughs = (obj) => {
        if (Array.isArray(obj)) {
          if (!validateNames(obj)) throw new Error("Invalid save: missing 'name'");
        } else if (obj && typeof obj === "object") {
          for (const val of Object.values(obj)) {
            checkPlaythroughs(val);
          }
        }
      };

      checkPlaythroughs(playthroughs);

      // ✅ Commit after passing check
      GAME.playthroughs = playthroughs;

      saveGame();
      renderTable();
      updateStats();

      alert("Import successful!");
    } catch (err) {
      console.error(err);
      alert("Invalid save file. Import cancelled.");
    } finally {
      e.target.value = ""; // reset input
    }
  };

  reader.readAsText(file);
});


/* =====================================================
   INIT
   ===================================================== */


renderTable();