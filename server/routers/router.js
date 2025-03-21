const Router = require('express');
const userRouter = require('./userRouter');
const quizRouter = require('./quizRouter');

const router = new Router();

router.use('/user',userRouter);
router.use('/quiz', quizRouter);

module.exports = router;