// Состояние: массив задач
const tasks = [];

// Элементы формы
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

// Два контейнера: активные и выполненные задачи
const taskListActive = document.getElementById("task-list-active");
const taskListDone = document.getElementById("task-list-done");

// Генерация простого id
function generateId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

// Добавление новой задачи
function addTask(title) {
  const newTask = {
    id: generateId(),
    title,
    done: false
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();
}
const TASKS_STORAGE_KEY = "dcc_tasks";

function saveTasksToStorage() {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(TASKS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Не удалось сохранить задачи в localStorage", error);
  }
}

function loadTasksFromStorage() {
  try {
    const serialized = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!serialized) return;

    const parsed = JSON.parse(serialized);
    if (Array.isArray(parsed)) {
      // Немного защищаемся: берём только нужные поля
      parsed.forEach((item) => {
        if (item && typeof item.title === "string") {
          tasks.push({
            id: item.id || generateId(),
            title: item.title,
            done: Boolean(item.done)
          });
        }
      });
    }
  } catch (error) {
    console.error("Не удалось загрузить задачи из localStorage", error);
  }
}

function completeTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = true;
  saveTasksToStorage();
  renderTasks();
}

function restoreTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = false;
  saveTasksToStorage();
  renderTasks();
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  tasks.splice(index, 1);
  saveTasksToStorage();
  renderTasks();
}

// Рендер задач в интерфейс
function renderTasks() {
  // Очищаем оба списка
  taskListActive.innerHTML = "";
  taskListDone.innerHTML = "";

  const hasActive = tasks.some((t) => !t.done);
  const hasDone = tasks.some((t) => t.done);

  // Если нет активных задач — показываем плейсхолдер
  if (!hasActive) {
    const placeholder = document.createElement("p");
    placeholder.className = "empty-placeholder";
    placeholder.textContent = "Нет текущих задач";
    taskListActive.appendChild(placeholder);
  }

  // Если нет выполненных задач — показываем плейсхолдер
  if (!hasDone) {
    const placeholder = document.createElement("p");
    placeholder.className = "empty-placeholder";
    placeholder.textContent = "Нет выполненных задач";
    taskListDone.appendChild(placeholder);
  }

  // Проходим по всем задачам
  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;

    if (task.done) {
      titleSpan.style.textDecoration = "line-through";
      titleSpan.style.color = "#6b7280";
    }

    const buttonsContainer = document.createElement("div");

    if (!task.done) {
      const completeButton = document.createElement("button");
      completeButton.textContent = "Выполнить";
      completeButton.className = "task-complete-button";
      completeButton.addEventListener("click", () => completeTask(task.id));
      buttonsContainer.appendChild(completeButton);
    } else {
      const restoreButton = document.createElement("button");
      restoreButton.textContent = "Вернуть";
      restoreButton.className = "task-restore-button";
      restoreButton.addEventListener("click", () => restoreTask(task.id));
      buttonsContainer.appendChild(restoreButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.className = "task-delete-button";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    buttonsContainer.appendChild(deleteButton);

    item.appendChild(titleSpan);
    item.appendChild(buttonsContainer);

    if (!task.done) {
      // Если это первая активная задача — убираем плейсхолдер
      if (hasActive && taskListActive.firstChild?.classList.contains("empty-placeholder")) {
        taskListActive.innerHTML = "";
      }
      taskListActive.appendChild(item);
    } else {
      // Если это первая выполненная задача — убираем плейсхолдер
      if (hasDone && taskListDone.firstChild?.classList.contains("empty-placeholder")) {
        taskListDone.innerHTML = "";
      }
      taskListDone.appendChild(item);
    }
  });
}

// Обработчик формы
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = taskInput.value.trim();
  if (!value) return;

  addTask(value);
  taskInput.value = "";
});

// Инициализация при загрузке страницы
loadTasksFromStorage();
renderTasks();