import { useState, React } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { registerUser } from '../../http/userAPI';

const Adduser = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [email, setEmail] = useState();
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addUser = () => {
        if (!name || !surname || !email || !login || !password) {
            alert('Зполните пустые поля')
        } else {
            let candidate = {
                name: name,
                surname:surname,
                email:email,
                login:login,
                password:password
            }
            registerUser(candidate)
            window.location.reload()
        }
    }

    return(
        <div>
            <Button className="mt-3"
                    variant="success"
                    onClick={handleShow}>Добавить пользователя</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание нового пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control value={name} onChange={e => setName(e.target.value)} type='text' placeholder='Имя...'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Фамилия пользователя</Form.Label>
                            <Form.Control value={surname} onChange={e => setSurname(e.target.value)} type='text' placeholder='фамилия...'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>e-mail пользователя</Form.Label>
                            <Form.Control value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='example@mail.ru'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Логин пользователя</Form.Label>
                            <Form.Control value={login} onChange={e => setLogin(e.target.value)} type='text' placeholder='логин...'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Пароль пользователя</Form.Label>
                            <Form.Control value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder='пароль...'/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                    type='submit'
                    variant='success'
                    onClick={() => {
                        addUser();
                    }}>Создать</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Adduser;