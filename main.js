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
  renderTasks();
}

// Пометить задачу как выполненную
function completeTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = true;
  renderTasks();
}

// Вернуть задачу обратно в активные
function restoreTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = false;
  renderTasks();
}

// Удалить задачу
function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  tasks.splice(index, 1);
  renderTasks();
}

// Рендер задач в интерфейс
function renderTasks() {
  // Очищаем оба списка
  taskListActive.innerHTML = "";
  taskListDone.innerHTML = "";

  // Проходим по всем задачам
  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;

    if (task.done) {
      titleSpan.style.textDecoration = "line-through";
      titleSpan.style.color = "#6b7280"; // серый
    }

    const buttonsContainer = document.createElement("div");

    // Кнопка выполнить / вернуть
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

    // Кнопка удалить
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.className = "task-delete-button";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    buttonsContainer.appendChild(deleteButton);

    item.appendChild(titleSpan);
    item.appendChild(buttonsContainer);

    // Кладём элемент в нужный список
    if (!task.done) {
      taskListActive.appendChild(item);
    } else {
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