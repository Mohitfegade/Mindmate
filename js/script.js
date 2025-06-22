// MindMate JS - script.js

console.log("MindMate is ready to execute 🚀");

let mode = 'pomodoro';
let durations = {
  pomodoro: 25,
  short: 5,
  long: 15
};
let pomoCount = 0;
let pomosBeforeLong = 4;
let interval;
let totalSeconds = durations.pomodoro * 60;
let isRunning = false;
let autoStart = false;
let currentTask = '';
let streak = localStorage.getItem('streak') || 0;

function updateDisplay() {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  document.getElementById("minutes").textContent = String(mins).padStart(2, '0');
  document.getElementById("seconds").textContent = String(secs).padStart(2, '0');
}

function setMode(newMode) {
  clearInterval(interval);
  mode = newMode;
  durations.pomodoro = parseInt(document.getElementById("pomodoroDuration").value);
  durations.short = parseInt(document.getElementById("shortDuration").value);
  durations.long = parseInt(document.getElementById("longDuration").value);
  pomosBeforeLong = parseInt(document.getElementById("pomosBeforeLong").value);
  autoStart = document.getElementById("autoStart").checked;
  totalSeconds = durations[mode] * 60;
  updateDisplay();
  isRunning = false;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  currentTask = document.getElementById("taskInput").value;
  document.getElementById("task-label").textContent = currentTask ? `Task: ${currentTask}` : '';

  interval = setInterval(() => {
    totalSeconds--;
    updateDisplay();

    if (totalSeconds <= 0) {
      clearInterval(interval);
      isRunning = false;
      handleSessionEnd();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  totalSeconds = durations[mode] * 60;
  updateDisplay();
}

function handleSessionEnd() {
  new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3").play();
  alert("Session Complete!");

  if (mode === 'pomodoro') {
    pomoCount++;
    document.getElementById("pomoCount").textContent = `Completed Pomodoros: ${pomoCount}`;
    if (pomoCount % pomosBeforeLong === 0) {
      setMode('long');
    } else {
      setMode('short');
    }
  } else {
    setMode('pomodoro');
  }

  if (autoStart) startTimer();

  updateStreak();
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const lastDay = localStorage.getItem('lastPomodoroDay');

  if (lastDay !== today) {
    streak++;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastPomodoroDay', today);
  }

  document.getElementById("streak").textContent = `🔥 Streak: ${streak} days`;
}

function addTodo() {
  const input = document.getElementById("todoInput");
  if (input.value.trim() !== '') {
    const li = document.createElement("li");
    li.textContent = input.value;
    li.onclick = () => li.remove();
    document.getElementById("todoList").appendChild(li);
    input.value = '';
  }
}

function toggleFocusMode() {
  const enabled = document.getElementById("focusToggle").checked;
  document.body.style.backgroundColor = enabled ? '#000' : '#0f0f0f';
}

function toggleSettings() {
  const settings = document.querySelector(".settings");
  settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
}

// === Habit Tracker Features ===
const habitList = document.getElementById("habitList");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitModal = document.getElementById("habitModal");
const habitForm = document.getElementById("habitForm");
const closeModal = document.getElementById("closeHabitModal");

addHabitBtn.addEventListener("click", () => {
  habitModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  habitModal.style.display = "none";
});

habitForm.addEventListener("submit", (e) => {
  habitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const habitName = document.getElementById("habitName").value;
    const habitEmoji = document.getElementById("habitEmoji").value || "✅";
    const habitColor = document.getElementById("habitColor").value || "#1dd1a1";

    const habitEl = document.createElement("div");
    habitEl.className = "habit-card";
    habitEl.style.borderColor = habitColor;

    // Title
    habitEl.innerHTML = `<strong>${habitEmoji}</strong> ${habitName}`;

    // Weekly tracker
    const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
    const trackerDiv = document.createElement("div");
    trackerDiv.className = "weekly-tracker";

    weekDays.forEach((day, index) => {
      const dayEl = document.createElement("span");
      dayEl.textContent = day;
      dayEl.dataset.day = index;
      dayEl.onclick = () => dayEl.classList.toggle("checked");
      trackerDiv.appendChild(dayEl);
    });
    habitEl.appendChild(trackerDiv);

    // Daily input
    const progressDiv = document.createElement("div");
    progressDiv.className = "habit-progress";
    progressDiv.innerHTML = `<input type="number" min="0" max="10" value="0" class="daily-count" /> / 10`;
    habitEl.appendChild(progressDiv);

    // Add to list
    habitList.appendChild(habitEl);
    habitModal.style.display = "none";
    habitForm.reset();
  });



  // Load on start
  window.onload = () => {
    setMode('pomodoro');
    updateDisplay();
    document.getElementById("streak").textContent = `🔥 Streak: ${streak} days`;

    const detailsElements = document.querySelectorAll("details");

    detailsElements.forEach((detail) => {
      detail.addEventListener("toggle", () => {
        if (detail.open) {
          console.log(`Opened: ${detail.querySelector("summary").innerText}`);
        }
      });

      const summary = detail.querySelector("summary");
      if (summary) {
        summary.addEventListener("click", () => {
          detail.style.transition = "transform 0.2s ease";
          detail.style.transform = "scale(1.01)";
          setTimeout(() => {
            detail.style.transform = "scale(1)";
          }, 200);
        });
      }
    });

    if (!localStorage.getItem("visitedMindMate")) {
      alert("Welcome to MindMate! 💡 Let’s execute your vision.");
      localStorage.setItem("visitedMindMate", "true");
    }

    // Initially hide settings
    document.querySelector(".settings").style.display = 'none';
  };
