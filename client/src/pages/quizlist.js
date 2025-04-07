import React, { useContext, useEffect } from "react";
import  NavTemplate  from "../components/template/NavBar"
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { DeleteQuiz, GetQuizzes } from "../http/QuizAPI";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { QUIZ_ROUTE, QUIZ_CONTRUCTOR_ROUTE } from "../utils/consts";


const Quizlist = observer(() => {
    
    const {quiz} = useContext(Context);
    const navigate = useNavigate()
    useEffect(() => {
        GetQuizzes().then(data => {
            quiz.SetQuizzes(data)
        })
    }, [])

    const deleteQuiz = (id) => {
       DeleteQuiz(id)
       window.location.reload();
    }
    return(
        <div>
           <NavTemplate/>
           <Container className="mt-5">
            <h2>Список всех опросов</h2>
            <Button
            variant="success"
            className="mt-3"
            onClick={() => {
                navigate(QUIZ_CONTRUCTOR_ROUTE)
            }}
            >Создать опрос</Button>
            <Row className="mt-3">
                    {
                        quiz.Quizzes.map(Element =>
                            <Col md={3} className="mt-3">
                                <Card key={Element.id} style={{width:300, height:400, cursor:"pointer"}} className="d-flex f-column align-items-center justify-content-center"
                                onClick={ () => {
                                    navigate(QUIZ_ROUTE + `/${Element.id}`)
                                }
                                }>
                                    <h4>{Element.title}</h4>
                                    <div>{Element.description}</div>
                                </Card>
                                <Button
                                variant="danger"
                                className="mt-2"
                                type="submit"
                                onClick={() => {
                                    deleteQuiz(Element.id)
                                }}
                                >Удалить</Button>
                            </Col>
                        )
                    }
            </Row>
           </Container>
        </div>
    );
})

export default Quizlist;