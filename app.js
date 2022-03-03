// ************************************************************************************************
// GLOBALS
// ************************************************************************************************
let todos = [];
let users = [];
const todoList = document.getElementById(`todoList`);
// ************************************************************************************************
// EVENT ATTACHMENT
// ************************************************************************************************
document.addEventListener(`DOMContentLoaded`, appInit);
// ************************************************************************************************
// EVENT LOGIC
// ************************************************************************************************
function appInit() {
  Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
    [todos, users] = values;
    todos.forEach((todo) => printTodo(todo));
    console.log(users);
  });
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
