const clock = document.getElementById("clock");
const date = document.getElementById("date");
const greeting = document.getElementById("greeting");

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const quotes = [
    "Stay focused and keep going.",
    "Small progress is still progress.",
    "Your future self will thank you.",
    "Focus on what you can control.",
    "Do it now. Future you will be glad.",
    "Consistency beats motivation."
];


// =========================
// CLOCK
// =========================

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes}:${seconds}`;


    date.textContent =
        now.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });


    const hour = now.getHours();

    if (hour < 12) {
        greeting.textContent = "Good morning.";
    }
    else if (hour < 18) {
        greeting.textContent = "Good afternoon.";
    }
    else {
        greeting.textContent = "Good evening.";
    }
}


setInterval(updateClock, 1000);

updateClock();


// =========================
// TODO
// =========================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


function renderTasks() {

    taskList.innerHTML = "";


    tasks.forEach((task, index) => {

        const item =
            document.createElement("div");

        item.className =
            `task ${task.done ? "done" : ""}`;


        item.innerHTML = `
            <input
                type="checkbox"
                ${task.done ? "checked" : ""}
            >

            <span>${task.text}</span>

            <button class="delete">×</button>
        `;


        const checkbox =
            item.querySelector("input");

        const deleteBtn =
            item.querySelector(".delete");


        checkbox.addEventListener(
            "change",
            () => {

                tasks[index].done =
                    checkbox.checked;

                saveTasks();

                renderTasks();
            }
        );


        deleteBtn.addEventListener(
            "click",
            () => {

                tasks.splice(index, 1);

                saveTasks();

                renderTasks();
            }
        );


        taskList.appendChild(item);
    });


    updateProgress();
}


function addTask() {

    const text =
        taskInput.value.trim();


    if (!text) return;


    tasks.push({
        text: text,
        done: false
    });


    taskInput.value = "";

    saveTasks();

    renderTasks();
}


document
    .getElementById("addBtn")
    .addEventListener(
        "click",
        addTask
    );


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            addTask();
        }

    }
);


function updateProgress() {

    if (tasks.length === 0) {

        progressBar.style.width = "0%";
        progressText.textContent = "0%";

        return;
    }


    const completed =
        tasks.filter(task => task.done).length;


    const percent =
        Math.round(
            completed / tasks.length * 100
        );


    progressBar.style.width =
        `${percent}%`;

    progressText.textContent =
        `${percent}%`;
}


renderTasks();


// =========================
// QUOTE
// =========================

document
    .getElementById("quoteBtn")
    .addEventListener(
        "click",
        () => {

            const random =
                Math.floor(
                    Math.random() * quotes.length
                );

            document.getElementById("quote")
                .textContent =
                quotes[random];
        }
    );


// =========================
// THEME
// =========================

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle("light");

            const light =
                document.body.classList.contains("light");

            localStorage.setItem(
                "theme",
                light ? "light" : "dark"
            );
        }
    );


if (
    localStorage.getItem("theme")
    === "light"
) {
    document.body.classList.add("light");
}