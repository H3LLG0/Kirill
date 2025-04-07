import React from "react";
import  NavTemplate  from "../components/template/NavBar"
import { Container } from "react-bootstrap";

const UserProfile = () => {
    return(
        <div>
            <NavTemplate/>
            <Container>
                <h2 className="mt-3">Профиль пользователя</h2>
            </Container>
        </div>
    );
}

export default UserProfile;