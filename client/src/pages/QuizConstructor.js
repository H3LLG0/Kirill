import React, { useState } from 'react';
import  NavTemplate  from "../components/template/NavBar";
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { CreateNewQuiz } from '../http/QuizAPI';
import { useNavigate } from "react-router-dom";
import { QUIZLIST_ROUTE } from '../utils/consts';

const Constructor = () => {
    const navigate = useNavigate();
    const [quizTitle, setquizTitle] = useState('');
    const [quizDescription, setquizDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [image, setImage] = useState(null);
  
    const addQuestion = () => {
      setQuestions([
        ...questions,
        {
          id: Date.now(),
          text: '',
          type: 'radio',
          options: [],
        },
      ]);
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
      }
    };
  
    const deleteQuestion = (questionId) => {
      setQuestions(questions.filter((question) => question.id !== questionId));
    };
  
    const updateQuestionText = (questionId, text) => {
      setQuestions(
        questions.map((question) =>
          question.id === questionId ? { ...question, text } : question
        )
      );
    };
  
    const updateQuestionType = (questionId, type) => {
      setQuestions(
        questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                type,
                options: type === 'range' ? question.options.slice(0, 2) : question.options,
              }
            : question
        )
      );
    };
  
    const addOption = (questionId) => {
      setQuestions(
        questions.map((question) => {
          if (question.id === questionId) {
            if (question.type === 'range' && question.options.length >= 2) {
              return question;
            }
            return {
              ...question,
              options: [...question.options, { id: Date.now(), text: '' }],
            };
          }
          return question;
        })
      );
    };
  
    const updateOptionText = (questionId, optionId, text) => {
      setQuestions(
        questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, text } : option
              ),
            };
          }
          return question;
        })
      );
    };
  
    const deleteOption = (questionId, optionId) => {
      setQuestions(
        questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              options: question.options.filter((option) => option.id !== optionId),
            };
          }
          return question;
        })
      );
    };

    const Save = () => {
      const quizData = new FormData();
      quizData.append('title', quizTitle);
      quizData.append('description', quizDescription);
      quizData.append('certificate', image);
      quizData.append(
        'questions',
        JSON.stringify(
          questions.map((question) => ({
            question: question.text,
            type: question.type,
            answerVariants: question.options.map((option) => option.text),
          }))
        )
      );
      
          if (!quizTitle || !quizDescription) {
            alert('Пожалуйста, заполните название и описание опроса.');
            return;
          }
          if (questions.length === 0) {
            alert('Добавьте хотя бы один вопрос.');
            return;
          }
          console.log(quizData)
          CreateNewQuiz(quizData).catch((e) => {console.log(e)})
    }

    return(
        <div>
            <NavTemplate/>
                <Container className='mb-3'>
                    <h2 className="mt-3">Создание опроса</h2>
                    <Form className="mt-3">
                        <Form.Group>
                        <Form.Label>Название опроса</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название опроса..."
                            style={{ width: 600 }}
                            value={quizTitle}
                            onChange={(e) => setquizTitle(e.target.value)}
                        />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Загрузите сертификат</Form.Label>
                            <Form.Control
                              type='file'
                              style={{ width: 400 }}
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Описание опроса</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Текст описания"
                            style={{ width: 600 }}
                            value={quizDescription}
                            onChange={(e) => setquizDescription(e.target.value)}
                        />
                        </Form.Group>
                        {questions.map((question, index) => (
                        <div key={question.id} className="mt-4 p-3 border rounded">
                            <Row>
                            <Col>
                                <Form.Group>
                                <Form.Label>Вопрос {index + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите текст вопроса..."
                                    value={question.text}
                                    onChange={(e) => updateQuestionText(question.id, e.target.value)}
                                />
                                </Form.Group>
                                <Button
                                variant="danger"
                                onClick={() => deleteQuestion(question.id)}
                                className='mt-2'
                                >
                                Удалить вопрос
                                </Button>
                            </Col>
                            </Row>

                            <Form.Group className="mt-3">
                            <Form.Label>Тип вопроса</Form.Label>
                            <Form.Control
                                as="select"
                                value={question.type}
                                onChange={(e) => updateQuestionType(question.id, e.target.value)}
                                style={{ width: 300 }}
                            >
                                <option value="radio">Radio (один вариант ответа)</option>
                                <option value="checkbox">Checkbox (несколько вариантов ответа)</option>
                                <option value="range">Range (ползунок с 2 вариантами)</option>
                            </Form.Control>
                            </Form.Group>

                            <div className="mt-3">
                            <h6>Варианты ответа:</h6>
                            {question.options.map((option, optIndex) => (
                                <Row key={option.id} className="mb-2">
                                <Col>
                                    <Form.Control
                                    type="text"
                                    placeholder={`Вариант ${optIndex + 1}`}
                                    value={option.text}
                                    onChange={(e) =>
                                        updateOptionText(question.id, option.id, e.target.value)
                                    }
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                    variant="danger"
                                    onClick={() => deleteOption(question.id, option.id)}
                                    >
                                    Удалить
                                    </Button>
                                </Col>
                                </Row>
                            ))}
                            <Button
                                variant="secondary"
                                className="mt-2"
                                onClick={() => addOption(question.id)}
                                disabled={question.type === 'range' && question.options.length >= 2}
                            >
                                Добавить вариант ответа
                            </Button>
                            </div>
                        </div>
                        ))}

                    <Button className="mt-2" onClick={addQuestion}>
                    Добавить вопрос
                    </Button>
                    <div className='mt-2'>
                    <Button
                        variant='success'
                        onClick={() => {
                            Save();
                            // navigate(QUIZLIST_ROUTE);
                        }}
                    >Сохранить опрос</Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default Constructor;