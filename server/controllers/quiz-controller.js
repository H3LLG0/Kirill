const {Quiz, QuizQuestion, AnswerVariant} = require('../database/models/models');
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
    
        // 1. Находим текущую запись опроса в базе данных с вопросами и вариантами ответов
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
    
        // 2. Получаем вопросы из входящих данных (если они есть в req.body.quiz_questions)
        const updatedQuestions = updatedQuizData.quiz_questions || [];
    
        // 3. Сравниваем вопросы из базы данных с вопросами из req.body
        const existingQuestions = existingQuiz.quiz_questions || [];
    
        // 4. Определяем, какие вопросы нужно удалить (те, что есть в базе, но отсутствуют в req.body)
        const existingQuestionIds = existingQuestions.map((q) => q.id);
        const updatedQuestionIds = updatedQuestions
          .map((q) => q.id)
          .filter((id) => id); // Фильтруем, чтобы исключить новые вопросы без id
        const questionsToDelete = existingQuestions.filter(
          (q) => !updatedQuestionIds.includes(q.id)
        );
    
        // 5. Удаляем лишние вопросы и их варианты ответов
        for (const question of questionsToDelete) {
          await AnswerVariant.destroy({ where: { quizQuestionId: question.id } });
          await QuizQuestion.destroy({ where: { id: question.id } });
        }
    
        // 6. Обрабатываем вопросы из req.body
        for (const updatedQuestion of updatedQuestions) {
          if (updatedQuestion.id) {
            // 7. Если вопрос уже существует, обновляем его (и его варианты ответов)
            const existingQuestion = existingQuestions.find((q) => q.id === updatedQuestion.id);
            if (existingQuestion) {
              // Обновляем текст вопроса и тип, если они изменились
              await QuizQuestion.update(
                {
                  question: updatedQuestion.question,
                  type: updatedQuestion.type,
                },
                { where: { id: updatedQuestion.id } }
              );
    
              // 8. Сравниваем варианты ответов
              const existingVariants = existingQuestion.answer_variants || [];
              const updatedVariants = updatedQuestion.answer_variants || [];
    
              const existingVariantIds = existingVariants.map((v) => v.id);
              const updatedVariantIds = updatedVariants
                .map((v) => v.id)
                .filter((id) => id);
              const variantsToDelete = existingVariants.filter(
                (v) => !updatedVariantIds.includes(v.id)
              );
    
              // Удаляем лишние варианты ответов
              for (const variant of variantsToDelete) {
                await AnswerVariant.destroy({ where: { id: variant.id } });
              }
    
              // Обрабатываем варианты ответов
              for (const updatedVariant of updatedVariants) {
                if (updatedVariant.id) {
                  // Обновляем существующий вариант ответа
                  await AnswerVariant.update(
                    { answer: updatedVariant.answer },
                    { where: { id: updatedVariant.id } }
                  );
                } if(updatedVariant.isNew) {
                  // Добавляем новый вариант ответа
                  await AnswerVariant.create({
                    answer: updatedVariant.answer,
                    quizQuestionId: updatedQuestion.id,
                  });
                }
              }
            }
          }
          if(updatedQuestion.isNew) {
            // 9. Если вопроса нет в базе (новый вопрос), создаем его
            const newQuestion = await QuizQuestion.create({
              question: updatedQuestion.question,
              type: updatedQuestion.type,
              quizId: quizId,
            });
    
            // Добавляем варианты ответов для нового вопроса
            const updatedVariants = updatedQuestion.answer_variants || [];
            for (const variant of updatedVariants) {
              await AnswerVariant.create({
                answer: variant.answer,
                quizQuestionId: newQuestion.id,
              });
            }
          }
        }
    
        // 10. Обновляем основную информацию об опросе (title, description)
        await Quiz.update(
          {
            title: updatedQuizData.title,
            description: updatedQuizData.description,
          },
          { where: { id: quizId } }
        );
    
        // 11. Возвращаем обновленный опрос
        const updatedQuiz = await Quiz.findByPk(quizId, {
          include: [
            {
              model: QuizQuestion,
              include: [AnswerVariant],
            },
          ],
        });
    
        res.status(200).json({ message: 'Опрос обновлён', quiz: updatedQuiz });
      } catch (error) {
        console.error('Ошибка при сохранении изменений опроса:', error);
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
      }
    }
}

module.exports = new QuizController();