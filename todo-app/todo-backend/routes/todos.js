const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id)
  res.send(todo)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const todosCount = await redis.getAsync('added_todos')
  await redis.setAsync('added_todos', +todosCount + 1)

  res.send(todo);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const updatedTodo = await Todo.findByIdAndUpdate(
    id, 
    {
      text: req.body.text,
      done: req.body.done
    }, 
    { new: true, runValidators: true }
  )

  res.send(updatedTodo)
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  
  const todosCount = +(await redis.getAsync('added_todos'))
  await redis.setAsync('added_todos', todosCount === 0 ? 0: todosCount - 1)

  res.sendStatus(200);
});



router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
