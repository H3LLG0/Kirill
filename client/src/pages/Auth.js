import React, { useContext, useState} from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getLogin } from "../http/userAPI";
import { observer } from "mobx-react-lite"
import { Context } from "..";
import { QUIZLIST_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";


const Auth = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate()
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();

    const signIn = async () => {
        try {
            if(!login || !password) {
                alert('Зполните пустые поля')
            } else {
                let data;
                data = await getLogin(login, password)
                user.setUser(data);
                user.setIsAuth(true);
                navigate(QUIZLIST_ROUTE)
                window.location.reload()
            }
        } catch(e) {
            console.log(e)
            alert(e.response.data.message)
        }
    }

    return(
        <Container className="d-flex justify-content-center align-items-center"
            style={{height:window.innerHeight - 54}}>
            <Card>
                <h3 className="m-auto mt-3">Авторизирируйтесь в системе</h3>
                <Form style={{width:600}} className="p-5 d-flex flex-column">
                    <Form.Control className="mt-3" placeholder="Логин" value={login} onChange={e => setLogin(e.target.value)}/>
                    <Form.Control className="mt-3" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} type="password"/>
                    <Button className="mt-3" onClick={signIn}>Войти</Button>
                </Form>
            </Card>
        </Container>
    );
})

export default Auth;