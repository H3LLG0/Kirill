import { GetOneQuiz } from "../http/QuizAPI";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import  NavTemplate  from "../components/template/NavBar";
import {Button, Container, Form,} from "react-bootstrap"

const QuizComponent = () => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        GetOneQuiz(id)
            .then(data => {
                if (data) {
                    setQuiz(data);
                } else {
                    setError("Опрс не найден");
                }
                setLoading(false);
            })
            .catch(error => {
                setError("Ошибка при загрузке данных");
                setLoading(false);
                console.error(error);
            });
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
    if (!quiz) return <p> Опрос не найден</p>;

    return (
        <div>
            <NavTemplate/>
            <Container className="mt-3">
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      <h2>Вопросы:</h2>
      {quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
        <Form>
          {quiz.quiz_questions.map((question) => (
            <div key={question.id}>
              <h3>{question.question}</h3>
              {question.answer_variants && question.answer_variants.length > 0 ? (
                <div>
                  {/* Вывод ответов в зависимости от типа вопроса */}
                  {question.type === 'checkbox' ? (
                    // Для checkbox — можно выбрать несколько вариантов
                    question.answer_variants.map((variant) => (
                      <Form.Check
                        key={variant.id}
                        type="checkbox"
                        id={`checkbox-${variant.id}`}
                        label={variant.answer}
                        name={`question-${question.id}`}
                      />
                    ))
                  ) : question.type === 'radio' ? (
                    // Для radio — можно выбрать только один вариант
                    question.answer_variants.map((variant) => (
                      <Form.Check
                        key={variant.id}
                        type="radio"
                        id={`radio-${variant.id}`}
                        label={variant.answer}
                        name={`question-${question.id}`} // имя одинаковое для группы radio
                      />
                    ))
                  ) : question.type === 'range' ? (
                    // Для range — ползунок с минимальным и максимальным значением
                    question.answer_variants.length === 2 ? (
                      <Form.Group>
                        <Form.Label>
                          Выберите значение от {question.answer_variants[0].answer} до{' '}
                          {question.answer_variants[1].answer}
                        </Form.Label>
                        <div className="d-flex justify-content-between">
                            <span>
                                {question.answer_variants[0].answer}
                            </span>
                            <span>
                            {question.answer_variants[1].answer}
                            </span>
                        </div>
                        <Form.Control
                          type="range"
                          min={parseInt(question.answer_variants[0].answer, 10)}
                          max={parseInt(question.answer_variants[1].answer, 10)}
                          name={`question-${question.id}`}
                        />
                      </Form.Group>
                    ) : (
                      <p>Для вопроса типа range требуется ровно два варианта ответа (min и max).</p>
                    )
                  ) : (
                    <p>Тип вопроса не поддерживается</p>
                  )}
                </div>
              ) : (
                <p>Варианты ответа отсутствуют</p>
              )}
            </div>
          ))}
          <Button className="mt-3" type="submit">
            Отправить
          </Button>
        </Form>
      ) : (
        <p>Вопросы отсутствуют</p>
      )}
    </Container>
        </div>
    );
};

export default QuizComponent;