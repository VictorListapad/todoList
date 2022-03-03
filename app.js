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

// ************************************************************************************************
// ASYNC LOGIC
// ************************************************************************************************
async function getAllTodos() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos`);
  const data = await res.json();
  return data;
}

async function getAllUsers() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const data = await res.json();
  return data;
}

async function createTodo(todo) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const newTodo = await res.json();
  printTodo(newTodo);
}

async function updateStatus(todoId, completed) {
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
  const data = await res.json();
  console.log(data);
}
