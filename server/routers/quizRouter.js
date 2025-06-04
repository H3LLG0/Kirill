const Router = require('express');
const QuizController = require('../controllers/quiz-controller');
const AuthMiddleware = require('../middlewares/auth-middleware');

const quizRouter = new Router();

quizRouter.post('/CreateQuiz', AuthMiddleware, QuizController.createQuiz);
quizRouter.get('/getAllQuizzes', AuthMiddleware, QuizController.readQuizzes);
quizRouter.post('/GetOneQuiz', QuizController.readOneQuiz);
quizRouter.post('/SaveQuizChanges', AuthMiddleware, QuizController.SaveQuizChanges);
quizRouter.post('/SaveQuizResults', QuizController.saveQuizResults);
quizRouter.post('/GetQuizResults', AuthMiddleware, QuizController.GetQuizResults)
quizRouter.post('/DeleteQuiz', AuthMiddleware, QuizController.DeleteQuiz)
quizRouter.post('/SaveQuizCertificate', AuthMiddleware, QuizController.SaveQuizCertificate)

module.exports = quizRouter;