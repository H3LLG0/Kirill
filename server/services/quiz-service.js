class QuizService {
    
    processQuestionStats(question) {
        const questionStats = {
          questionId: question.id,
          questionText: question.question,
          questionType: question.type,
          answers: [],
        };
  
        const totalResponses = question.quiz_results.length;
  
        if (question.type === 'text') {
          const answerCounts = {};
          question.quiz_results.forEach((result) => {
            const answer = result.answer || 'Без ответа';
            answerCounts[answer] = (answerCounts[answer] || 0) + 1;
          });
  
          questionStats.answers = Object.entries(answerCounts).map(([answer, count]) => ({
            answer,
            count,
            percentage: totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(2) : 0,
          }));
        } else if (question.type === 'range') {
          const answerCounts = {};
          question.answer_variants.forEach((variant) => {
            answerCounts[variant.answer] = {
              answer: variant.answer,
              count: 0,
            };
          });
  
          question.quiz_results.forEach((result) => {
            const answer = result.answer || 'Без ответа';
            if (answerCounts[answer]) {
              answerCounts[answer].count += 1;
            } else {
              answerCounts[answer] = {
                answer,
                count: 1,
              };
            }
          });
  
          questionStats.answers = Object.values(answerCounts).map((stat) => ({
            answer: stat.answer,
            count: stat.count,
            percentage: totalResponses > 0 ? ((stat.count / totalResponses) * 100).toFixed(2) : 0,
          }));
          questionStats.answers.sort((a, b) => Number(a.answer) - Number(b.answer));
        } else if (question.type === 'radio') {
          const answerCounts = {};
          question.answer_variants.forEach((variant) => {
            answerCounts[variant.answer] = {
              answer: variant.answer,
              count: 0,
            };
          });
  
          question.quiz_results.forEach((result) => {
            const answer = result.answer || 'Без ответа';
            if (answerCounts[answer]) {
              answerCounts[answer].count += 1;
            } else {
              answerCounts[answer] = {
                answer,
                count: 1,
              };
            }
          });
  
          questionStats.answers = Object.values(answerCounts).map((stat) => ({
            answer: stat.answer,
            count: stat.count,
            percentage: totalResponses > 0 ? ((stat.count / totalResponses) * 100).toFixed(2) : 0,
          }));
        } else if (question.type === 'checkbox') {
          const answerCounts = {};
          question.answer_variants.forEach((variant) => {
            answerCounts[variant.answer] = {
              answer: variant.answer,
              count: 0,
            };
          });
  
          question.quiz_results.forEach((result) => {
            const answers = result.answer ? result.answer.split(',') : ['Без ответа'];
            answers.forEach((answer) => {
              const trimmedAnswer = answer.trim();
              if (answerCounts[trimmedAnswer]) {
                answerCounts[trimmedAnswer].count += 1;
              } else {
                answerCounts[trimmedAnswer] = {
                  answer: trimmedAnswer,
                  count: 1,
                };
              }
            });
          });
  
          questionStats.answers = Object.values(answerCounts).map((stat) => ({
            answer: stat.answer,
            count: stat.count,
            percentage: totalResponses > 0 ? ((stat.count / totalResponses) * 100).toFixed(2) : 0,
          }));
        }
  
        return questionStats;
      };
}

module.exports = new QuizService();