
const express = require('express');
const router = express.Router();
const { logWorkout, getLogs, deleteLog} = require('../Controller/logWorkout');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, logWorkout);
router.get('/', authMiddleware, getLogs);
router.delete('/:id', authMiddleware, deleteLog);

module.exports = router;