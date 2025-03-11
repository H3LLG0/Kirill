import React, { useContext } from "react";
import { Context } from "../../index";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const NavTemplate = () => {
    const {user} = useContext(Context)
    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Название</Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/">ссылка</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavTemplate;