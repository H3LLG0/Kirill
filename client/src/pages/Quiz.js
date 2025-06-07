import { addCertificate, GetOneQuiz, SaveQuizChanges, SaveQuizResults } from "../http/QuizAPI";
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import  NavTemplate  from "../components/template/NavBar";
import {Button, Container, Form,} from "react-bootstrap"
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { QUIZ_STAT_ROUTE, SERVERURL } from "../utils/consts";

const QuizComponent = observer(() => {

    const navigate = useNavigate();
    const {user} = useContext(Context);
    const [isEditing, setIsEditing] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [userAnswers, setUserAnswers] = useState({
      "quizId": id
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        setLoading(true);
        GetOneQuiz(id)
            .then(data => {
                if (data) {
                    setQuiz(data);

                } else {
                    setError("Опрос не найден");
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
        const handleToggleEdit = () => {
          setIsEditing(!isEditing);
        };

        const handleAddQuestion = () => {
            const newQuestion = {
              id: Date.now(),
              question: "Новый вопрос",
              type: "radio",
              answer_variants: [],
              isNew: true,
            };
            setQuiz({
              ...quiz,
              quiz_questions: [...quiz.quiz_questions, newQuestion],
            });
          };

          const handleDeleteQuestion = (questionId) => {
            setQuiz({
              ...quiz,
              quiz_questions: quiz.quiz_questions.filter((q) => q.id !== questionId),
            });
          };

          const handleQuestionChange = (questionId, newText) => {
            setQuiz({
              ...quiz,
              quiz_questions: quiz.quiz_questions.map((q) =>
                q.id === questionId ? { ...q, question: newText } : q
              ),
            });
          };

          const handleQuestionTypeChange = (questionId, newType) => {
            setQuiz({
              ...quiz,
              quiz_questions: quiz.quiz_questions.map((q) =>
                q.id === questionId ? { ...q, type: newType } : q
              ),
            });
          };
            const handleAddAnswerVariant = (questionId) => {
                setQuiz({
                ...quiz,
                quiz_questions: quiz.quiz_questions.map((q) =>
                    q.id === questionId
                    ? {
                        ...q,
                        answer_variants: [
                            ...q.answer_variants,
                            {
                            id: Date.now(), 
                            answer: "Новый вариант ответа",
                            isNew: true, 
                            },
                        ],
                        }
                    : q
                ),
                });
            };
            const handleDeleteAnswerVariant = (questionId, variantId) => {
                setQuiz({
                ...quiz,
                quiz_questions: quiz.quiz_questions.map((q) =>
                    q.id === questionId
                    ? {
                        ...q,
                        answer_variants: q.answer_variants.filter(
                            (v) => v.id !== variantId
                        ),
                        }
                    : q
                ),
                });
            };

            const handleAnswerVariantChange = (questionId, variantId, newText) => {
                setQuiz({
                ...quiz,
                quiz_questions: quiz.quiz_questions.map((q) =>
                    q.id === questionId
                    ? {
                        ...q,
                        answer_variants: q.answer_variants.map((v) =>
                            v.id === variantId ? { ...v, answer: newText } : v
                        ),
                        }
                    : q
                ),
                });
            };

            const handleCheckboxChange = (questionId, value, checked) => {
              setUserAnswers((prev) => {
                const questionAnswers = prev[questionId] || [];
                if (checked) {
                  return {
                    ...prev,
                    [questionId]: [...questionAnswers, value]
                  };
                } else {
                  return {
                    ...prev,
                    [questionId]: questionAnswers.filter((id) => id !== value)
                  };
                }
              });
            };
          
            const handleRadioChange = (questionId, value) => {
              setUserAnswers((prev) => ({
                ...prev,
                [questionId]: value
              }));
            };
          
            const handleRangeChange = (questionId, value) => {
              setUserAnswers((prev) => ({
                ...prev,
                [questionId]: value
              }));
            };
          
            const handleSubmit = () => {
              console.log(userAnswers)
              SaveQuizResults(userAnswers);
            };

            const toStat = () => {
              navigate(QUIZ_STAT_ROUTE + `/${id}`)
            }

            const handleImageChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
                const imageUrl = URL.createObjectURL(file);
                setPreview(imageUrl);
              }
            };

            const handleSubmitImage = (e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append('image', image);
              formData.append('id', quiz.id)
              if(image) {
                addCertificate(formData)
              }
            }

          return (
            <div>
              <NavTemplate />
              <Container className="mt-3">
                <h1>{quiz.title}</h1>
                <p>{quiz.description}</p>
                <Form.Group className="mb-3">
                  {user.isAuth ? (
                    <div className="control-bar">
                      <Form.Check
                        type="switch"
                        id="edit-mode-switch"
                        label={
                          isEditing
                            ? "Режим редактирования включен"
                            : "Режим редактирования выключен"
                        }
                        checked={isEditing}
                        onChange={handleToggleEdit}
                      />
                      <div>
                        <Button
                          className="mt-2"
                          onClick={() => {
                            toStat()
                          }}
                        >Результаты опроса</Button>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </Form.Group>
                {
                  user.isAuth ? (
                    <div>
                      {
                        quiz.certificate ? (
                          <div>
                            {
                              isEditing ? (
                                <div>
                                  <h2>Сертификат</h2>
                                  <Form onSubmit={handleSubmitImage}>
                                    <Form.Group controlId="formFile" className="mb-3">
                                      <Form.Label>Выберите изображение</Form.Label>
                                      <Form.Control
                                        type="file"
                                        accept="image/*" // Ограничиваем выбор только изображениями
                                        onChange={handleImageChange}
                                      />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                      Отправить
                                    </Button>
                                  </Form>
                                  {preview ? (
                                    <div className="mt-3">
                                      <h5>Предпросмотр:</h5>
                                      <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />
                                    </div>
                                  ) : (<img src={SERVERURL+`/${quiz.certificate}`}/>)}
                                </div>
                              ) : (
                                <div>
                                  <h2>Сертификат</h2>
                                  <img src={SERVERURL+`/${quiz.certificate}`}/>
                                </div>
                              )
                            }
                          </div>
                        ) : (
                          'сертификат не добавлен'
                        )
                      }
                    </div>
                  ) : (
                    ''
                  )
                }
                <h2>Вопросы:</h2>
                {quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
                  <Form>
                    {quiz.quiz_questions.map((question) => (
                      <div key={question.id} className="mb-4">
                        {isEditing ? (
                          <div>
                            <Form.Group className="mb-3">
                              <Form.Label>Вопрос:</Form.Label>
                              <Form.Control
                                type="text"
                                value={question.question}
                                onChange={(e) =>
                                  handleQuestionChange(question.id, e.target.value)
                                }
                                name={`question-text-${question.id}`}
                              />
                              <Form.Label className="mt-2">Тип вопроса:</Form.Label>
                              <Form.Control
                                as="select"
                                value={question.type}
                                onChange={(e) =>
                                  handleQuestionTypeChange(question.id, e.target.value)
                                }
                                name={`question-type-${question.id}`}
                              >
                                <option value="checkbox">Checkbox</option>
                                <option value="radio">Radio</option>
                                <option value="range">Range</option>
                              </Form.Control>
                            </Form.Group>
                            <div>
                            <Button
                                variant="danger"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                Удалить вопрос
                              </Button>
                              <Button
                                onClick={() =>
                                    handleAddAnswerVariant(question.id)
                                }
                                style={{marginLeft:10}}
                                >
                                Добавть вариант ответа
                                </Button>
                            </div>
                          </div>
                        ) : (
                          <h3>{question.question}</h3>
                        )}
                        {question.answer_variants && question.answer_variants.length > 0 ? (
                          <div>
                            {isEditing ? (
                              <div>
                                {question.type === "range" ? (
                                  question.answer_variants.length === 2 ? (
                                    <div>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Минимальное значение:</Form.Label>
                                        <Form.Control
                                          type="number"
                                          defaultValue={parseInt(
                                            question.answer_variants[0].answer,
                                            10
                                          )}
                                          name={`variant-min-${question.id}`}
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Максимальное значение:</Form.Label>
                                        <Form.Control
                                          type="number"
                                          defaultValue={parseInt(
                                            question.answer_variants[1].answer,
                                            10
                                          )}
                                          name={`variant-max-${question.id}`}
                                        />
                                      </Form.Group>
                                    </div>
                                  ) : (
                                    <div>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Минимальное значение:</Form.Label>
                                        <Form.Control
                                          type="number"
                                          name={`variant-min-${question.id}`}
                                        />
                                      </Form.Group>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Максимальное значение:</Form.Label>
                                        <Form.Control
                                          type="number"
                                          name={`variant-max-${question.id}`}
                                        />
                                      </Form.Group>
                                    </div>
                                  )
                                ) : (
                                  question.answer_variants.map((variant) => (
                                    <Form.Group key={variant.id} className="mb-3">
                                      <Form.Label>Вариант ответа:</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={variant.answer}
                                        onChange={(e) =>
                                            handleAnswerVariantChange(
                                            question.id,
                                            variant.id,
                                            e.target.value
                                            )
                                        }
                                        name={`variant-${variant.id}`}
                                        />
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleDeleteAnswerVariant(
                                                question.id,
                                                variant.id
                                                )
                                            }
                                            className="mt-2"
                                            >
                                            Удалить
                                        </Button>
                                    </Form.Group>
                                  ))
                                )}
                              </div>
                            ) : (
                              <div>
                                {question.type === "checkbox" ? (
                                  question.answer_variants.map((variant) => (
                                    <Form.Check
                                      key={variant.id}
                                      type="checkbox"
                                      id={`checkbox-${variant.id}`}
                                      label={variant.answer}
                                      name={`question-${question.id}`}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          question.id,
                                          variant.answer,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  ))
                                ) : question.type === "radio" ? (
                                  question.answer_variants.map((variant) => (
                                    <Form.Check
                                      key={variant.id}
                                      type="radio"
                                      id={`radio-${variant.id}`}
                                      label={variant.answer}
                                      name={`question-${question.id}`}
                                      onChange={() =>
                                        handleRadioChange(question.id, variant.answer)
                                      }
                                    />
                                  ))
                                ) : question.type === "range" ? (
                                  question.answer_variants.length === 2 ? (
                                    <Form.Group>
                                      <Form.Label>
                                        Выберите значение от{" "}
                                        {question.answer_variants[0].answer} до{" "}
                                        {question.answer_variants[1].answer}
                                      </Form.Label>
                                      <div className="d-flex justify-content-between">
                                        <span>{question.answer_variants[0].answer}</span>
                                        <span>{question.answer_variants[1].answer}</span>
                                      </div>
                                      <Form.Control
                                        type="range"
                                        min={parseInt(
                                          question.answer_variants[0].answer,
                                          10
                                        )}
                                        max={parseInt(
                                          question.answer_variants[1].answer,
                                          10
                                        )}
                                        name={`question-${question.id}`}
                                        onChange={(e) => {
                                          handleRangeChange(question.id, e.target.value);
                                        }}
                                      />
                                    </Form.Group>
                                  ) : (
                                    <p>
                                      Для вопроса типа range требуется ровно два варианта
                                      ответа (min и max).
                                    </p>
                                  )
                                ) : (
                                  <p>Тип вопроса не поддерживается</p>
                                )}
                              </div>
                            )}
                        </div>
                        ) : (
                        <p></p>
                        )}
                    </div>
                    ))}
                    <div>
                        {isEditing ? (<Button onClick={handleAddQuestion}>Добавить вопрос</Button>) : (<div></div>)}
                    </div>
                    {
                      isEditing ? (
                        <Button
                          type="submit"
                          className="mt-3 mb-3"
                          variant="success"
                          onClick={() => {
                            SaveQuizChanges(quiz);
                          }
                          }
                          >Сохранить</Button>
                      ) : (
                        <Button
                        type="submit"
                        variant="success"
                        className="mb-3"
                        onClick={() => {
                          handleSubmit()
                        }}
                        >Отправить</Button>
                      )
                    }
                </Form>
                ) : (
                <p>Вопросы отсутствуют</p>
                )}
            </Container>
        </div>
        );
});

export default QuizComponent;