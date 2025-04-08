import {React, useContext} from "react";
import  NavTemplate  from "../components/template/NavBar"
import { Button, Container } from "react-bootstrap";
import { Context } from "..";

const UserProfile = () => {
    const {user} = useContext(Context)

    return(
        <div>
            <NavTemplate/>
            <Container>
                <h2 className="mt-3">Профиль пользователя</h2>
                <h3 className="mt-3">Здравствуйте {user.user.name} {user.user.surname}</h3>
                <div className="mt-3">
                    <div>
                        <span>email: {user.user.email}</span>
                    </div>
                    <div className="mt-3">
                        <span>login: {user.user.login}</span>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default UserProfile;