const Router = require('express');
const QuizController = require('../controllers/quiz-controller');
const RoleMiddleware = require('../middlewares/role-middleware');
const AuthMiddleware = require('../middlewares/auth-middleware');

const quizRouter = new Router();

quizRouter.post('/createQuiz', AuthMiddleware, RoleMiddleware,  QuizController.createQuiz);
quizRouter.get('/getAllQuizzes', AuthMiddleware, QuizController.readQuizzes);
quizRouter.post('/GetOneQuiz', QuizController.readOneQuiz);
quizRouter.post('/SaveQuizChanges', AuthMiddleware, QuizController.SaveQuizChanges)

module.exports = quizRouter;