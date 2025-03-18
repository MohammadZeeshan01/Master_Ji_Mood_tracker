// Get all the elements we need
const saveButton = document.getElementById("save-mood");
const dailyButton = document.getElementById("daily");
const weeklyButton = document.getElementById("week");
const monthlyButton = document.getElementById("month");
const dailyView = document.getElementById("daily-view");
const weeklyView = document.getElementById("weekly-view");
const monthlyView = document.getElementById("monthly-view");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const currentMonthDisplay = document.getElementById("current-month-display");
const calendarDays = document.getElementById("calendar-days");

let mood = null;
let currentDate = new Date();

// Mood selection
document.querySelectorAll(".mood-btn").forEach((button) => {
  button.addEventListener("click", function () {
    mood = this.getAttribute("data-mood");
    console.log("Mood Selected:", mood);
    document.getElementById("output").innerText = `Mood: ${mood}`;
  });
});

// Save the selected mood
saveButton.addEventListener("click", function () {
  if (!mood) {
    alert("Please select a mood before saving.");
    return;
  }

  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  let moodEntry = { date: date, mood: mood };
  let storedMoods = JSON.parse(localStorage.getItem("dailymoods")) || [];
  const existingEntryIndex = storedMoods.findIndex(
    (entry) => entry.date === date
  );
  if (existingEntryIndex !== -1) {
    storedMoods[existingEntryIndex].mood = mood;
  } else {
    storedMoods.push(moodEntry);
  }
  localStorage.setItem("dailymoods", JSON.stringify(storedMoods));
  alert("Mood saved successfully!");

  // Update views
  showDailyMoods();
  showWeeklyMoods();
  showMonthlyMoods();
});

// Show daily Mood
function showDailyMoods() {
  const container = document.getElementById("daily-moods");
  container.innerHTML = "";
  let storedMoods = JSON.parse(localStorage.getItem("dailymoods")) || [];
  if (storedMoods.length === 0) {
    container.innerHTML = "<p>No mood entries yet.</p>";
    return;
  }
  storedMoods.sort((a, b) => new Date(b.date) - new Date(a.date));
  storedMoods.forEach((entry) => {
    const moodItem = document.createElement("div");
    moodItem.textContent = `${entry.date}: ${entry.mood}`;
    container.appendChild(moodItem);
  });
}

// Weekly mood
function showWeeklyMoods() {
  const container = document.getElementById("weekly-moods");
  container.innerHTML = "";
  let storedMoods = JSON.parse(localStorage.getItem("dailymoods")) || [];
  if (storedMoods.length === 0) {
    container.innerHTML = "<p>No mood entries yet.</p>";
    return;
  }
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const currentWeekStart = new Date(localDate);
  currentWeekStart.setDate(localDate.getDate() - localDate.getDay()); // Go back to Sunday
  currentWeekStart.setHours(0, 0, 0, 0);
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  const weekName = `Week of ${currentWeekStart.toLocaleDateString("en-US")}`;
  const currentWeekMoods = storedMoods.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= currentWeekStart && entryDate <= currentWeekEnd;
  });
  const weekContainer = document.createElement("div");
  weekContainer.className = "week-container";

  const weekTitle = document.createElement("h4");
  weekTitle.textContent = weekName;
  weekContainer.appendChild(weekTitle);

  if (currentWeekMoods.length === 0) {
    const emptyWeek = document.createElement("p");
    emptyWeek.textContent = "No entries this week";
    emptyWeek.style.fontStyle = "italic";
    emptyWeek.style.color = "#888";
    weekContainer.appendChild(emptyWeek);
  } else {
    const moodSummary = document.createElement("div");
    moodSummary.className = "mood-summary";
    moodSummary.style.display = "flex";
    moodSummary.style.flexDirection = "row";
    moodSummary.style.justifyContent = "space-between";
    moodSummary.style.padding = "10px";
    moodSummary.style.border = "1px solid #ccc";
    moodSummary.style.borderRadius = "5px";
    moodSummary.style.backgroundColor = "#f8f8f8";
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentWeekStart);
      dayDate.setDate(currentWeekStart.getDate() + i);
      const dayStr =
        dayDate.getFullYear() +
        "-" +
        String(dayDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dayDate.getDate()).padStart(2, "0");
      const dayBox = document.createElement("div");
      dayBox.className = "day-box";
      dayBox.style.flex = "1";
      dayBox.style.textAlign = "center";
      dayBox.style.padding = "10px";
      dayBox.style.margin = "5px";
      dayBox.style.border = "1px solid #ddd";
      dayBox.style.borderRadius = "5px";
      dayBox.style.backgroundColor = "#fff";
      const dayName = document.createElement("div");
      dayName.textContent = dayDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      dayName.style.fontWeight = "bold";
      const dateNumber = document.createElement("div");
      dateNumber.textContent = dayDate.getDate();
      dayBox.appendChild(dayName);
      dayBox.appendChild(dateNumber);

      const dayMood = currentWeekMoods.find((entry) => entry.date === dayStr);

      if (dayMood) {
        const moodEmoji = document.createElement("div");
        moodEmoji.textContent = dayMood.mood;
        moodEmoji.style.fontSize = "24px";
        dayBox.appendChild(moodEmoji);
        dayBox.style.backgroundColor = "#e6e1ff";
      } else {
        const noMood = document.createElement("div");
        noMood.textContent = "No mood recorded";
        noMood.style.color = "#ccc";
        dayBox.appendChild(noMood);
      }

      moodSummary.appendChild(dayBox);
    }

    weekContainer.appendChild(moodSummary);
  }

  container.appendChild(weekContainer);
}

// Monthly Mood
function showMonthlyMoods() {
  renderCalendar(currentDate);
}
function switchView(viewBtn, viewContent) {
  let allButtons = document.querySelectorAll(".view-btn");
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("active");
  }
  let allViews = document.querySelectorAll(".view-content");
  for (let i = 0; i < allViews.length; i++) {
    allViews[i].classList.remove("active");
  }
  viewBtn.classList.add("active");
  viewContent.classList.add("active");
}

dailyButton.addEventListener("click", function () {
  switchView(dailyButton, dailyView);
  showDailyMoods();
});

weeklyButton.addEventListener("click", function () {
  switchView(weeklyButton, weeklyView);
  showWeeklyMoods();
});

monthlyButton.addEventListener("click", function () {
  switchView(monthlyButton, monthlyView);
  showMonthlyMoods();
});

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  currentMonthDisplay.textContent =
    date.toLocaleString("default", { month: "long" }) + " " + year;
  calendarDays.innerHTML = "";
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const savedMoods = JSON.parse(localStorage.getItem("dailymoods")) || [];
  const moodsByDate = {};
  for (let i = 0; i < savedMoods.length; i++) {
    moodsByDate[savedMoods[i].date] = savedMoods[i].mood;
  }

  for (let i = 0; i < firstDayOfWeek; i++) {
    let emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    let dayBox = document.createElement("div");
    dayBox.className = "calendar-day";
    dayBox.textContent = day;

    let monthStr = String(month + 1).padStart(2, "0");
    let dayStr = String(day).padStart(2, "0");
    let dateStr = `${year}-${monthStr}-${dayStr}`;

    if (moodsByDate[dateStr]) {
      dayBox.classList.add("has-mood");

      let emoji = document.createElement("span");
      emoji.className = "mood-emoji";
      emoji.textContent = moodsByDate[dateStr];
      dayBox.appendChild(emoji);

      dayBox.title = `Mood on ${new Date(dateStr).toLocaleDateString()}: ${
        moodsByDate[dateStr]
      }`;
    }

    calendarDays.appendChild(dayBox);
  }
}

prevMonthBtn.addEventListener("click", function () {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", function () {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

document.addEventListener("DOMContentLoaded", function () {
  showDailyMoods();
  showWeeklyMoods();
  renderCalendar(currentDate);
});
