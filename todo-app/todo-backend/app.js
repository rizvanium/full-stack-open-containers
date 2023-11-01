const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const redis = require('./redis')
const { Todo } = require('./mongo')
const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
const statisticsRouter = require('./routes/statistics');

redis.getAsync('added_todos').then((todosCount) => {
  if (todosCount == null) {
    Todo.countDocuments().then(result => {
      redis.setAsync('added_todos', result);
    });
  }
})

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/todos', todosRouter);
app.use('/statistics', statisticsRouter);

module.exports = app;
