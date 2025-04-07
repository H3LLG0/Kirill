import { useState, React, useEffect} from "react";
import  NavTemplate  from "../components/template/NavBar";
import { getUsers, UserToAdmin, DeleteUser } from "../http/userAPI";
import { Button, Container, Table, Modal } from "react-bootstrap";
import Adduser from "../components/modal/Adduser";

const Admin = () => {

    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [toAdminModal, setToAdminModal] = useState(false);

    const handleCloseDeleteModal = () => setDeleteModal(false);
    const handleShowDeleteModal = () => setDeleteModal(true);
    const handleCloseToAdminModal = () => setToAdminModal(false);
    const handleShowToAdminModal = () => setToAdminModal(true);


    useEffect(() => {
        setLoading(true);
        getUsers().then(data => {
            setUsers(data)
            setLoading(false);
        }) .catch(e => {
           setError(e);
        })
    },[])

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
    if (!users) return <p> Пользователи не найден</p>;

    const userToAdmin = (userId) => {
        UserToAdmin(userId);
        window.location.reload();
    }

    const deleteUser = (userId) => {
        DeleteUser(userId);
        window.location.reload();
    }


    return(
        <div>
            <NavTemplate/>
            <Container>
                <h2 className="mt-3">Администрирование</h2>
                <Adduser/>
                <Table className="mt-3 mb-3" striped bordered>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>e-mail</th>
                            <th>Тип</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map(Element =>
                                <tr>
                                    <td>{Element.id}</td>
                                    <td>{Element.name}</td>
                                    <td>{Element.surname}</td>
                                    <td>{Element.email}</td>
                                    <td>{Element.type}</td>
                                    <td>{Element.type === 'ADMIN' ? ("нет доступных действий"):(<div className="d-flex justify-content-around">
                                        <Button variant="success" onClick={() => {
                                            handleShowToAdminModal()
                                        }}>Назначить администратором</Button>
                                        <Button variant="danger" onClick={() => {
                                            handleShowDeleteModal()
                                        }}>Удалить пользователя</Button>
                                    </div>)}</td>
                                    <Modal show={toAdminModal} onHide={handleCloseToAdminModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Назначить пользователя {Element.name} {Element.surname} администратором?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="d-flex justify-content-around">
                                            <Button variant="success"
                                            onClick={() => {
                                                userToAdmin(Element.id)
                                            }}>Назначть</Button>
                                            <Button variant="danger"
                                            onClick={() => {
                                                handleCloseToAdminModal()
                                            }}>Отмена</Button>
                                        </Modal.Body>
                                    </Modal>
                                    <Modal show={deleteModal} onHide={handleCloseDeleteModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Удалить пользователя {Element.name} {Element.surname}?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="d-flex justify-content-around">
                                            <Button variant="success"
                                            onClick={() => {
                                                deleteUser(Element.id)
                                            }}>Удалить</Button>
                                            <Button variant="danger"
                                            onClick={() => {
                                                handleCloseDeleteModal()
                                            }}>Отмена</Button>
                                        </Modal.Body>
                                    </Modal>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Admin;