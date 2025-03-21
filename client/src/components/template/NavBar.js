import React, { useContext, useEffect } from "react";
import { Context } from "../../index";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/esm/Button";
import { ADMIN_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, QUIZLIST_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";

const NavTemplate = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const adminMenu = () => {
        if(user.user.type === 'ADMIN') {
            return(
                <Nav.Link href={ADMIN_ROUTE}>Администрирование</Nav.Link>
            )
        }
    }
    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.clear();
    }

    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>OPROS POPANDOS</Navbar.Brand>
                        {
                            user.isAuth ?
                            <Nav>
                                <Nav.Link href={QUIZLIST_ROUTE}>Список опросов</Nav.Link>
                                {adminMenu()}
                                <Nav.Link href={PROFILE_ROUTE}>{user.user.name + ' ' + user.user.surname}</Nav.Link>
                                <Button onClick={() => {
                                logOut();
                                navigate(LOGIN_ROUTE);
                                }}>Выйти</Button>
                            </Nav>
                            :
                            <Button onClick={() => {
                                logOut();
                                navigate(LOGIN_ROUTE);
                                }}>Вход</Button>
                        }
                </Container>
            </Navbar>
        </>
    );
}

export default NavTemplate;