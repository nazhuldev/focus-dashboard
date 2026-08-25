const clock =
    document.getElementById("clock");

const date =
    document.getElementById("date");

const greeting =
    document.getElementById("greeting");

const taskInput =
    document.getElementById("taskInput");

const taskList =
    document.getElementById("taskList");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const themeBtn =
    document.getElementById("themeBtn");

const quoteElement =
    document.getElementById("quote");

const quoteBtn =
    document.getElementById("quoteBtn");


/* =========================
   CLOCK
========================= */

function updateClock() {

    const now = new Date();

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}:${seconds}`;


    date.textContent =
        now.toLocaleDateString(
            "vi-VN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const hour =
        now.getHours();


    if (hour < 12) {

        greeting.textContent =
            "Good morning.";

    } else if (hour < 18) {

        greeting.textContent =
            "Good afternoon.";

    } else {

        greeting.textContent =
            "Good evening.";

    }
}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================
   TASKS
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


function updateProgress() {

    if (tasks.length === 0) {

        progressBar.style.width =
            "0%";

        progressText.textContent =
            "0%";

        return;
    }


    const completed =
        tasks.filter(
            task => task.done
        ).length;


    const percentage =
        Math.round(
            completed /
            tasks.length *
            100
        );


    progressBar.style.width =
        `${percentage}%`;

    progressText.textContent =
        `${percentage}%`;
}


function renderTasks() {

    taskList.innerHTML = "";


    tasks.forEach(
        (task, index) => {

            const item =
                document.createElement("div");


            item.className =
                `task ${task.done
                    ? "done"
                    : ""
                }`;


            item.innerHTML = `
                <input
                    type="checkbox"
                    ${task.done
                    ? "checked"
                    : ""
                }
                >

                <span>
                    ${escapeHTML(task.text)}
                </span>

                <button
                    class="delete"
                    aria-label="Delete task"
                >
                    ×
                </button>
            `;


            const checkbox =
                item.querySelector(
                    "input"
                );


            const deleteBtn =
                item.querySelector(
                    ".delete"
                );


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

                    tasks.splice(
                        index,
                        1
                    );

                    saveTasks();

                    renderTasks();
                }
            );


            taskList.appendChild(item);

        }
    );


    updateProgress();
}


function addTask() {

    const text =
        taskInput.value.trim();


    if (!text) return;


    tasks.push({
        text,
        done: false
    });


    taskInput.value = "";


    saveTasks();

    renderTasks();

    taskInput.focus();
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
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


renderTasks();


/* =========================
   QUOTES
========================= */

const quotes = [

    "Stay focused and keep going.",

    "Small progress is still progress.",

    "Your future self will thank you.",

    "Focus on what you can control.",

    "Consistency beats motivation.",

    "Build quietly. Let the result speak.",

    "One task at a time."

];


quoteBtn.addEventListener(
    "click",
    () => {

        const random =
            Math.floor(
                Math.random() *
                quotes.length
            );


        quoteElement.textContent =
            quotes[random];

    }
);


/* =========================
   THEME
========================= */

function updateThemeIcon() {

    const isLight =
        document.body.classList
            .contains("light");


    themeBtn.textContent =
        isLight
            ? "🌙"
            : "☀️";
}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList
                .contains("light");


        localStorage.setItem(
            "theme",
            isLight
                ? "light"
                : "dark"
        );


        updateThemeIcon();
    }
);


if (
    localStorage.getItem("theme")
    === "light"
) {

    document.body.classList.add(
        "light"
    );
}


updateThemeIcon();