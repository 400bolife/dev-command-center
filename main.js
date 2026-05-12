// Массив задач: здесь храним наши объекты { id, title, done }
const tasks = [];

// Находим элементы формы и списка в DOM
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Функция для генерации простого id
function generateId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

// Функция рендера всех задач в интерфейс
function renderTasks() {
  // Очищаем контейнер
  taskList.innerHTML = "";

  // Для каждой задачи создаём DOM-элемент
  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.className = "task-delete-button";

    // Обработчик удаления
    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    item.appendChild(titleSpan);
    item.appendChild(deleteButton);

    taskList.appendChild(item);
  });
}

// Функция добавления новой задачи
function addTask(title) {
  const newTask = {
    id: generateId(),
    title: title,
    done: false
  };

  tasks.push(newTask);
  renderTasks();
}

// Функция удаления задачи по id
function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

// Обработчик отправки формы задач
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // не перезагружаем страницу

  const value = taskInput.value.trim();
  if (!value) {
    return;
  }

  addTask(value);
  taskInput.value = "";
});