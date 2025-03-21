import React, { useContext, useEffect } from "react";
import  NavTemplate  from "../components/template/NavBar"
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { GetQuizzes } from "../http/QuizAPI";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { QUIZ_ROUTE } from "../utils/consts";


const Quizlist = observer(() => {
    
    const {quiz} = useContext(Context);
    const navigate = useNavigate()
    useEffect(() => {
        GetQuizzes().then(data => {
            quiz.SetQuizzes(data)
        })
    }, [])
    return(
        <div>
           <NavTemplate/>
           <Container className="mt-5">
            <h2>Список всех опросов</h2>
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
                            </Col>
                        )
                    }
            </Row>
           </Container>
        </div>
    );
})

export default Quizlist;