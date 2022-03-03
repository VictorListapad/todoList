(function () {
  // ************************************************************************************************
  // GLOBALS
  // ************************************************************************************************
  let todos = [];
  let users = [];
  const todoList = document.getElementById(`todoList`);
  const userOptions = document.getElementById(`userOptions`);
  const form = document.querySelector(`form`);
  // ************************************************************************************************
  // EVENT ATTACHMENT
  // ************************************************************************************************
  document.addEventListener(`DOMContentLoaded`, appInit);
  form.addEventListener(`submit`, handleSubmit);
  // ************************************************************************************************
  // EVENT LOGIC
  // ************************************************************************************************
  function appInit() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;
      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => printUserOption(user));
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
    form.todo.value = "";
  }

  function handleChange() {
    todoId = this.parentElement.dataset.id;
    completed = this.checked;
    this.parentElement.classList.toggle(`crossedOut`);
    updateStatus(todoId, completed);
  }

  function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
  }
  // ************************************************************************************************
  // BASIC LOGIC
  // ************************************************************************************************
  function printTodo({ userId, id, title, completed }) {
    const li = document.createElement(`li`);
    li.dataset.id = id;
    li.innerHTML = ` <span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span> `;
    const status = document.createElement(`input`);
    status.type = `checkbox`;
    status.checked = completed;
    if (status.checked) {
      li.classList.add(`crossedOut`);
    }
    status.addEventListener(`change`, handleChange);
    const deleteFromList = document.createElement(`span`);
    deleteFromList.addEventListener(`click`, handleClose);
    deleteFromList.innerHTML = `&times;`;
    deleteFromList.classList.add(`close`);
    li.append(deleteFromList);
    li.prepend(status);
    todoList.prepend(li);
  }

  function getUserName(userId) {
    const singleUser = users.find((user) => user.id === userId);
    return singleUser.name;
  }

  function printUserOption({ id, name }) {
    const option = document.createElement(`option`);
    option.innerText = name;
    option.value = id;
    userOptions.append(option);
  }

  function removeTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);
    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    todo.querySelector(`input`).removeEventListener(`change`, handleChange);
    todo.querySelector(`.close`).removeEventListener(`click`, handleClose);
    todo.remove();
  }
  // ************************************************************************************************
  // ASYNC LOGIC
  // ************************************************************************************************
  async function getAllTodos() {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos`);
      const data = await res.json();
      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function getAllUsers() {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
      const data = await res.json();
      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function createTodo(todo) {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();
      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  async function updateStatus(todoId, completed) {
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: `PATCH`,
          body: JSON.stringify({ completed }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      alertError(error);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId},`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      removeTodo(todoId);
    } catch (error) {
      alertError(error);
    }
  }
})();
