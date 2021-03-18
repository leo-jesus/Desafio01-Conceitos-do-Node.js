const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (!user) {
    return response.status(400).json({ error: "User not found!" })
  }

  request.user = user;
  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userAlreadyExist = users.some(
    (users => users.username === username));

  if (userAlreadyExist) {
    return response.status(400).json({ error: "User Already Exist!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const userTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(userTodo);
  return response.status(201).json(userTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(userTodo => userTodo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params

  const todo = user.todos.find(userTodo => userTodo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params

  const todoIndex = user.todos.findIndex(userTodo => userTodo.id === id);

  if (todoIndex ===-1) {
    return response.status(404).json({ error: "Todo not found" });
  }
  user.todos.splice(todoIndex, 1);

  return response.status(204).send();

});

module.exports = app;