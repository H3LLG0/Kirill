import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const Auth = () => {
    return(
        <Container className="d-flex justify-content-center align-items-center"
            style={{height:window.innerHeight - 54}}>
            <Card>
                <h2>Auth</h2>
            </Card>
        </Container>
    );
}

export default Auth;