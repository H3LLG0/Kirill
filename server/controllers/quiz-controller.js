const {Quiz, QuizQuestion, AnswerVariant} = require('../database/models/models');

class QuizController {
    async createQuiz(req, res, next) {
        try {
            const quizData = req.body;
            const quiz = await Quiz.create({ title: quizData.title, description: quizData.description });
  
            for (const question of quizData.questions) {
              const newQuestion = await QuizQuestion.create({
                question: question.question,
                type: question.type,
                quizId: quiz.id,
              });
          
              for (const variant of question.answerVariants) {
                await AnswerVariant.create({
                  answer: variant.answer,
                  quizQuestionId: newQuestion.id,
                });
              }
            }
            res.json({message:"Опрос добавлен"})
          
        } catch(e) {
            console.log(e)
        }
    }
    async readQuizzes(req, res, next) {
        try {
          const quizzes = await Quiz.findAll({
            include: [{
                model: QuizQuestion,
                include: [AnswerVariant]
            }]
        });
        res.json(quizzes)
        } catch(e) {
            console.log(e)
        }
    }
    async readOneQuiz(req, res, next) {
      try {
        const {id} = req.body;

        const quiz = await Quiz.findOne({
          include: [{
              model: QuizQuestion,
              include: [AnswerVariant]
          }],
          where: {id: id}
      })

      res.json(quiz)
      } catch(e) {
        console.log(e);
      }
    }
}

module.exports = new QuizController();