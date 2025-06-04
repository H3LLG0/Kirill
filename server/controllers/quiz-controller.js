const {Quiz, QuizQuestion, AnswerVariant, QuizResult} = require('../database/models/models');
const { Sequelize, Op } = require('sequelize');
const QuizService = require('../services/quiz-service');
const uuid = require('uuid')
const path = require('path')

class QuizController {
  async createQuiz(req, res, next) {
    try {
      // Получаем данные из req.body
      const { title, description, questions } = req.body;
  
      // Получаем файл из req.files
      const { certificate } = req.files || {};
  
      // Проверяем, что файл certificate существует
      if (!certificate) {
        const quiz = await Quiz.create({
          title,
          description,
        });
      } else {
        const certificateName = uuid.v4() + '.jpg';
  
        // Перемещаем файл в папку static
        await certificate.mv(path.resolve(__dirname, '..', 'static', certificateName));
    
        // Создаем запись опроса в базе данных
        const quiz = await Quiz.create({
          title,
          description,
          certificate: certificateName,
        });
      }
  
      // Парсим questions, если они пришли как строка JSON
      let parsedQuestions;
      try {
        parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
      } catch (e) {
        return res.status(400).json({ error: 'Неверный формат данных вопросов' });
      }
  
      // Проверяем, что parsedQuestions — это массив
      if (!Array.isArray(parsedQuestions)) {
        return res.status(400).json({ error: 'Поле questions должно быть массивом' });
      }
  
      // Обрабатываем каждый вопрос
      for (const question of parsedQuestions) {
        // Проверяем, что answerVariants — это массив
        if (!Array.isArray(question.answerVariants)) {
          return res.status(400).json({
            error: `Поле answerVariants в вопросе "${question.question}" должно быть массивом`,
          });
        }
  
        // Создаем запись вопроса в базе данных
        const newQuestion = await QuizQuestion.create({
          question: question.question,
          type: question.type,
          quizId: quiz.id,
        });
  
        // Обрабатываем варианты ответа
        for (const variant of question.answerVariants) {
          await AnswerVariant.create({
            answer: variant,
            quizQuestionId: newQuestion.id,
          });
        }
      }
  
      // Возвращаем успешный ответ
      res.json({ message: 'Опрос добавлен' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  async SaveQuizCertificate (req, res) {
    try {
      const {quizId} = req.body;
      const {newCertificate} = req.files;
  
      if (!newCertificate) {
        res.status(400).json({ error: 'Файл сертификата обязателен' });
      }
  
      const certificateName = uuid.v4() + '.jpg';
  
      await newCertificate.mv(path.resolve(__dirname, '..', 'static', certificateName));

      const quiz = await Quiz.findOne({where: {
        id:quizId
      }})

      quiz.certificate = certificateName

      await quiz.save()

    } catch(e) {
      console.log(e)
      res.status(500).json({ error: 'Ошибка сервера' });
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
            res.status(500).json({ error: 'Ошибка сервера'});
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
        res.status(500).json({ error: 'Ошибка сервера'});
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
      try {
          const quizResultData = req.body;
          const quizId = quizResultData.quizId;

      for (const [questionId, answer] of Object.entries(quizResultData)) {
        if (questionId === 'quizId') continue;

        if (Array.isArray(answer)) {
            for (const answerVariantId of answer) {
                await QuizResult.create({
                    quizId: quizId,
                    quizQuestionId: parseInt(questionId, 10),
                    answer: answerVariantId
                });
            }
        } else {
            await QuizResult.create({
                quizId: quizId,
                quizQuestionId: parseInt(questionId, 10),
                answer: answer
            });
        }
    }
    res.json({message:"Опрос сохранен"})
      } catch (e) {
        console.log(e)
      }
    }

  async GetQuizResults(req, res, next) {
    try {
      const quizId = req.body.id;

    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: QuizQuestion,
          include: [
            {
              model: AnswerVariant,
            },
            {
              model: QuizResult,
            },
          ],
        },
      ],
    });

    if (!quiz) {
      throw new Error('Опрос не найден');
    }

    const statistics = quiz.quiz_questions.map(QuizService.processQuestionStats);

    res.json({
      quizId: quiz.id,
      quizTitle: quiz.title,
      quizDescription: quiz.description,
      questions: statistics,
    })

    } catch(e) {
      console.log(e);
      res.status(500).json({ error: 'Ошибка сервера'});
    }
  }

  async DeleteQuiz(req, res, next) {
    try {
      const quizId = req.body.id

      const quiz = await Quiz.findByPk(quizId);
      if (!quiz) {
        res.status(404).json('Опрос не найден');
      }
      await quiz.destroy();
      
      res.json({ message: 'Опрос удалён'})
    } catch(e) {
      console.log(e);
      res.status(500).json({ error: 'Ошибка сервера'});
    }
  }
}

module.exports = new QuizController();