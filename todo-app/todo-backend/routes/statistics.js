const express = require('express');
const redis = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todosCount = await redis.getAsync('added_todos');

  res.send({
    "added_todos": +todosCount ?? 0
  });
});

module.exports = router;
