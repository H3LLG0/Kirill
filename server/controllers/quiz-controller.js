const {Quiz, QuizQuestion, AnswerVariant, QuizResult} = require('../database/models/models');
const sequelize = require('sequelize');

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

    async SaveQuizChanges(req, res, next) {
      try {
        const quizId = req.body.id;
        const updatedQuizData = req.body;

        const existingQuiz = await Quiz.findByPk(quizId, {
          include: [
            {
              model: QuizQuestion,
              include: [AnswerVariant],
            },
          ],
        });
    
        if (!existingQuiz) {
          res.status(404).json({ error: 'Опрос не найден' });
        }
    
        const updatedQuestions = updatedQuizData.quiz_questions || [];
    
        const existingQuestions = existingQuiz.quiz_questions || [];
    
        const existingQuestionIds = existingQuestions.map((q) => q.id);
        const updatedQuestionIds = updatedQuestions
          .map((q) => q.id)
          .filter((id) => id);
        const questionsToDelete = existingQuestions.filter(
          (q) => !updatedQuestionIds.includes(q.id)
        );
    
        for (const question of questionsToDelete) {
          await AnswerVariant.destroy({ where: { quizQuestionId: question.id } });
          await QuizQuestion.destroy({ where: { id: question.id } });
        }
    
        for (const updatedQuestion of updatedQuestions) {
          if (updatedQuestion.id) {
            const existingQuestion = existingQuestions.find((q) => q.id === updatedQuestion.id);
            if (existingQuestion) {
              await QuizQuestion.update(
                {
                  question: updatedQuestion.question,
                  type: updatedQuestion.type,
                },
                { where: { id: updatedQuestion.id } }
              );
    
              const existingVariants = existingQuestion.answer_variants || [];
              const updatedVariants = updatedQuestion.answer_variants || [];
    
              const existingVariantIds = existingVariants.map((v) => v.id);
              const updatedVariantIds = updatedVariants
                .map((v) => v.id)
                .filter((id) => id);
              const variantsToDelete = existingVariants.filter(
                (v) => !updatedVariantIds.includes(v.id)
              );
    
              for (const variant of variantsToDelete) {
                await AnswerVariant.destroy({ where: { id: variant.id } });
              }
    
              for (const updatedVariant of updatedVariants) {
                if (updatedVariant.id) {
                  await AnswerVariant.update(
                    { answer: updatedVariant.answer },
                    { where: { id: updatedVariant.id } }
                  );
                } if(updatedVariant.isNew) {
                  await AnswerVariant.create({
                    answer: updatedVariant.answer,
                    quizQuestionId: updatedQuestion.id,
                  });
                }
              }
            }
          }
          if(updatedQuestion.isNew) {
            const newQuestion = await QuizQuestion.create({
              question: updatedQuestion.question,
              type: updatedQuestion.type,
              quizId: quizId,
            });
    
            const updatedVariants = updatedQuestion.answer_variants || [];
            for (const variant of updatedVariants) {
              await AnswerVariant.create({
                answer: variant.answer,
                quizQuestionId: newQuestion.id,
              });
            }
          }
        }
        res.status(200).json({ message: 'Опрос обновлён'});
      } catch (error) {
        console.error('Ошибка при сохранении изменений опроса:', error);
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
      }
    }

    async saveQuizResults(req, res, next) {
      const quizResults = req.body;

      for(const key in quizResults) {
        const value = quizResults[key]
        if(key === "quizId") {

        } else if(Array.isArray(value)) {

        } else {

        }
      }
    }
}

module.exports = new QuizController();