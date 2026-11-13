const loginPage = document.getElementById("loginPage");

// TASK MANAGEMENT

let tasks = JSON.parse(localStorage.getItem("studymateTasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

function saveTasks() {
    localStorage.setItem("studymateTasks", JSON.stringify(tasks));
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function renderTasks() {
    saveTasks();
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.className = task.completed ? "completed" : "";

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        const completeButton = document.createElement("button");
        completeButton.textContent =
            task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", () => toggleTask(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        li.append(taskText, completeButton, deleteButton);
        taskList.appendChild(li);
    });

    updateProgress();
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressText").textContent =
        `${percentage}% completed`;

    document.getElementById("progressBar").style.width =
        `${percentage}%`;
}

// Task buttons
addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

// Task filters
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");
        renderTasks();
    });
});

// Display saved tasks
renderTasks();

const dashboardPage = document.getElementById("dashboardPage");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");

function showDashboard() {
    loginPage.hidden = true;
    dashboardPage.hidden = false;
}

function showLogin() {
    dashboardPage.hidden = true;
    loginPage.hidden = false;
}

function displayUsername() {
    const username = sessionStorage.getItem("studymateUsername");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (username && welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${username}!`;
    }
}

// Check login status
if (sessionStorage.getItem("studymateLoggedIn") === "true") {
    showDashboard();
    displayUsername();
} else {
    showLogin();
}

// Login button
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        loginMessage.textContent = "Please enter your details.";
        return;
    }

    const username = email.split("@")[0];

    sessionStorage.setItem("studymateUsername", username);
    sessionStorage.setItem("studymateLoggedIn", "true");

    showDashboard();
    displayUsername();
});

// Logout button
logoutButton.addEventListener("click", function() {
    sessionStorage.removeItem("studymateLoggedIn");
    sessionStorage.removeItem("studymateUsername");

    showLogin();
    loginForm.reset();
});