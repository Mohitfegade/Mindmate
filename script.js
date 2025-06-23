// ----------------- Pomodoro Timer -----------------

let timer;
let timeLeft = 1500; // default 25 mins
let mode = 'pomodoro'; // modes: 'pomodoro', 'short', 'long'
let pomoCount = 0;
let isRunning = false;

function setMode(selectedMode) {
  mode = selectedMode;
  if (mode === 'pomodoro') timeLeft = +document.getElementById("pomodoroDuration").value * 60;
  if (mode === 'short') timeLeft = +document.getElementById("shortDuration").value * 60;
  if (mode === 'long') timeLeft = +document.getElementById("longDuration").value * 60;
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
  document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      if (mode === 'pomodoro') {
        pomoCount++;
        document.getElementById("pomoCount").textContent = `Completed Pomodoros: ${pomoCount}`;
        if (pomoCount % +document.getElementById("pomosBeforeLong").value === 0) {
          setMode('long');
        } else {
          setMode('short');
        }
        if (document.getElementById("autoStart").checked) startTimer();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  pauseTimer();
  setMode(mode);
}

// ----------------- To-Do List -----------------

function addTodo() {
  const input = document.getElementById("todoInput");
  const task = input.value.trim();
  if (task === "") return;

  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" onchange="toggleComplete(this)">
    <span>${task}</span>
    <button onclick="this.parentElement.remove()">❌</button>
  `;
  document.getElementById("todoList").appendChild(li);
  input.value = "";
}

function toggleComplete(checkbox) {
  const span = checkbox.nextElementSibling;
  span.style.textDecoration = checkbox.checked ? "line-through" : "none";
}

// ----------------- Habit Tracker -----------------

document.getElementById("addHabitBtn").onclick = () => {
  document.getElementById("habitModal").style.display = "flex";
};

document.getElementById("closeHabitModal").onclick = () => {
  document.getElementById("habitModal").style.display = "none";
};

document.getElementById("habitForm").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("habitName").value;
  const emoji = document.getElementById("habitEmoji").value || "🔥";
  const color = document.getElementById("habitColor").value;

  const card = document.createElement("div");
  card.className = "habit-card";
  card.style.borderLeft = `5px solid ${color}`;
  card.innerHTML = `
    <strong>${emoji}</strong> ${name}
    <div class="weekly-tracker">
      ${["M", "T", "W", "T", "F", "S", "S"].map((d, i) =>
        `<span data-day="${i}" onclick="this.classList.toggle('done')">${d}</span>`
      ).join("")}
    </div>
  `;
  document.getElementById("habitList").appendChild(card);
  document.getElementById("habitModal").style.display = "none";
  this.reset();
};

// ----------------- Settings Toggle -----------------

function toggleSettings() {
  const settings = document.querySelector('.settings');
  settings.style.display = settings.style.display === "none" ? "block" : "none";
}

// ----------------- Init -----------------

window.onload = () => {
  setMode('pomodoro'); // default mode
  updateDisplay();
  document.querySelector('.settings').style.display = "none";
};
// Update mini widget with current timer/task
setInterval(() => {
  const min = document.getElementById("minutes").textContent;
  const sec = document.getElementById("seconds").textContent;
  const task = document.getElementById("taskInput").value || "No task";
  document.getElementById("miniTimer").textContent = `${min}:${sec}`;
  document.getElementById("miniTask").textContent = task;
}, 1000);

// Toggle widget
function toggleWidget(show) {
  const widget = document.getElementById("miniWidget");
  const button = document.getElementById("openWidgetBtn");
  if (show) {
    widget.style.display = "block";
    button.style.display = "none";
  } else {
    widget.style.display = "none";
    button.style.display = "block";
  }
}

// Show widget on load
window.addEventListener("load", () => {
  toggleWidget(true);
});

