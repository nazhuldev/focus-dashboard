const elements = {
    clock: document.getElementById("clock"),
    date: document.getElementById("date"),
    greeting: document.getElementById("greeting"),
    taskInput: document.getElementById("taskInput"),
    taskList: document.getElementById("taskList"),
    progressBar: document.getElementById("progressBar"),
    progressText: document.getElementById("progressText"),
    addButton: document.getElementById("addBtn"),
    quote: document.getElementById("quote"),
    quoteButton: document.getElementById("quoteBtn"),
    themeButton: document.getElementById("themeBtn")
};

const quotes = [
    "Stay focused and keep going.",
    "Small progress is still progress.",
    "Your future self will thank you.",
    "Focus on what you can control.",
    "Consistency beats motivation.",
    "Build quietly. Let the result speak.",
    "One task at a time."
];

let tasks = JSON.parse(localStorage.getItem("focusTasks")) || [];

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    elements.clock.textContent = `${hours}:${minutes}:${seconds}`;
    elements.date.textContent = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const hour = now.getHours();

    if (hour < 12) {
        elements.greeting.textContent = "Good morning.";
    } else if (hour < 18) {
        elements.greeting.textContent = "Good afternoon.";
    } else {
        elements.greeting.textContent = "Good evening.";
    }
}

function saveTasks() {
    localStorage.setItem("focusTasks", JSON.stringify(tasks));
}

function updateProgress() {
    if (!tasks.length) {
        elements.progressBar.style.width = "0%";
        elements.progressText.textContent = "0%";
        return;
    }

    const completed = tasks.filter(task => task.done).length;
    const percentage = Math.round((completed / tasks.length) * 100);

    elements.progressBar.style.width = `${percentage}%`;
    elements.progressText.textContent = `${percentage}%`;
}

function createTaskElement(task, index) {
    const item = document.createElement("div");
    item.className = `task${task.done ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Complete task: ${task.text}`);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);

    checkbox.addEventListener("change", () => {
        tasks[index].done = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    deleteButton.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    return item;
}

function renderTasks() {
    elements.taskList.replaceChildren();

    tasks.forEach((task, index) => {
        elements.taskList.appendChild(createTaskElement(task, index));
    });

    updateProgress();
}

function addTask() {
    const text = elements.taskInput.value.trim();

    if (!text) return;

    tasks.push({
        text,
        done: false
    });

    elements.taskInput.value = "";
    saveTasks();
    renderTasks();
    elements.taskInput.focus();
}

function showRandomQuote() {
    const currentQuote = elements.quote.textContent;
    let nextQuote = quotes[Math.floor(Math.random() * quotes.length)];

    while (quotes.length > 1 && nextQuote === currentQuote) {
        nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }

    elements.quote.textContent = nextQuote;
}

function updateThemeIcon() {
    const isLight = document.body.classList.contains("light");
    elements.themeButton.textContent = isLight ? "🌙" : "☀️";
    elements.themeButton.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
}

function toggleTheme() {
    document.body.classList.toggle("light");

    const theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("focusTheme", theme);

    updateThemeIcon();
}

function loadTheme() {
    if (localStorage.getItem("focusTheme") === "light") {
        document.body.classList.add("light");
    }

    updateThemeIcon();
}

elements.addButton.addEventListener("click", addTask);
elements.quoteButton.addEventListener("click", showRandomQuote);
elements.themeButton.addEventListener("click", toggleTheme);

elements.taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

updateClock();
setInterval(updateClock, 1000);

loadTheme();
renderTasks();