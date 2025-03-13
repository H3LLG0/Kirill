import React, { useContext } from "react";
import { Context } from "../../index";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/esm/Button";
import { LOGIN_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";

const NavTemplate = () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const logOut = () => {
        user.setUser(false);
        user.setIsAuth(false);
        localStorage.clear()
    }

    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Название</Navbar.Brand>
                    <Nav>
                        <Button onClick={() => {
                            logOut();
                            navigate(LOGIN_ROUTE)
                            }}>Выйти</Button>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavTemplate;