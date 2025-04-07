import React, { useState, useEffect } from "react";
import { GetOneQuiz, GetQuizResults } from "../http/QuizAPI";
import NavTemplate from "../components/template/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Card, ProgressBar, Badge } from "react-bootstrap";
import { QUIZ_ROUTE } from "../utils/consts";

const QuizStat = () => {
    const [quiz, setQuiz] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        GetOneQuiz(id)
            .then((data) => {
                if (data) {
                    setQuiz(data);
                } else {
                    setError("Опрос не найден");
                }
            })
            .catch((error) => {
                setError("Ошибка при загрузке данных");
                setLoading(false);
                console.error(error);
            });

        GetQuizResults(id)
            .then((data) => {
                if (data && data.data) {
                    setQuizData(data.data);
                } else {
                    setQuizData({ message: "Результаты еще не готовы" });
                }
                setLoading(false);
            })
            .catch((error) => {
                setError("Ошибка при загрузке данных");
                setLoading(false);
                console.error(error);
            });
    }, [id]); 

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
    if (!quiz) return <p>Опрос не найден</p>;

    const backToQuiz = () => {
        navigate(QUIZ_ROUTE + `/${id}`);
    };

    return (
        <div>
            <NavTemplate />
            <Container className="mb-3">
                <h2 className="mt-3">Статистика опроса: {quiz.title}</h2>
                <p>{quiz.description}</p>
                <Button onClick={backToQuiz}>Назад к опросу</Button>
                {quizData && quizData.questions ? (
                    quizData.questions.map((question) => (
                        <Card key={question.questionId} className="mt-3">
                            <Card.Body>
                                <Card.Title>{question.questionText}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Тип вопроса: <Badge bg="secondary">{question.questionType}</Badge>
                                </Card.Subtitle>
                                {question.answers.map((answer, index) => (
                                    <div key={index} className="my-3">
                                        <div className="d-flex justify-content-between">
                                            <span>{answer.answer}</span>
                                            <span>
                                                {answer.count} ({answer.percentage}%)
                                            </span>
                                        </div>
                                        <ProgressBar
                                            now={parseFloat(answer.percentage)}
                                            label={`${answer.percentage}%`}
                                            variant={
                                                parseFloat(answer.percentage) > 50 ? "success" : "info"
                                            }
                                        />
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>{quizData?.message || "Данные статистики недоступны"}</p>
                )}
            </Container>
        </div>
    );
};

export default QuizStat;