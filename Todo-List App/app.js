currentEditId = null;
class Todo {
  constructor(title, description, dueDate, priority, note) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.note = note;
  }
}

class TodoList {
  constructor() {
    const storedData = localStorage.getItem("storage");
    this.todos = storedData
      ? JSON.parse(storedData).map(
          (data) =>
            new Todo(
              data.title,
              data.description,
              data.dueDate,
              data.priority,
              data.note
            )
        )
      : [];
    this.container = document.getElementById("todoContainer");
    this.updateDisplay();
  }

  save() {
    localStorage.setItem("storage", JSON.stringify(this.todos));
  }

  addTodo(todo) {
    this.todos.push(todo);
    this.save();
    this.updateDisplay();
  }

  updateTodo(updateTodo) {
    this.todos = this.todos.map((todo) =>
      todo.id === updateTodo.id ? updateTodo : todo
    );
    this.save();
    this.updateDisplay();
  }

  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.save();
    this.updateDisplay();
  }

  updateDisplay() {
    this.container.innerHTML = this.todos
      .map(
        (todo) => `
        <div class="todo-item">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="todo-title">${todo.title}</span>
            <div>
              <button class="btn btn-sm btn-outline-info" onclick="editTodo('${todo.id}')">Edit</button>
              <button class="btn btn-sm btn-outline-danger" onclick="todoList.removeTodo('${todo.id}')">Delete</button>
            </div>
          </div>
          <p class="todo-detail mb-1"><strong>Description:</strong> ${todo.description}</p>
          <p class="todo-detail mb-1"><strong>Due:</strong> ${todo.dueDate}</p>
          <p class="todo-detail mb-1"><strong>Priority:</strong> ${todo.priority}</p>
          <p class="todo-detail"><strong>Note:</strong> ${todo.note}</p>
          <div class="form-check mt-2">
            <input class="form-check-input" type="checkbox">
            <label class="form-check-label">Complete</label>
          </div>
        </div>

    `
      )
      .join("");
  }
}

const todoList = new TodoList();
todoList.updateDisplay();

document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todoForm");

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const dueDate = form.dueDate.value;
    const priority = form.priority.value;
    const note = form.note.value;

    if (currentEditId) {
      const updatedTodo = new Todo(title, description, dueDate, priority, note);
      updatedTodo.id = currentEditId;
      todoList.updateTodo(updatedTodo);
    } else {
      const newTodo = new Todo(title, description, dueDate, priority, note);
      todoList.addTodo(newTodo);
    }
    const modalElement = document.getElementById("addTodo");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    form.reset();
    currentEditId = null;

  });
});

function editTodo(id) {
  const todo = todoList.todos.find((t) => t.id === id);
  if (!todo) return;

  currentEditId = id;

  document.getElementById("title").value = todo.title;
  document.getElementById("description").value = todo.description;
  document.getElementById("dueDate").value = todo.dueDate;
  document.getElementById("priority").value = todo.priority;
  document.getElementById("note").value = todo.note;

  new bootstrap.Modal(document.getElementById("addTodo")).show();

}

