import React from 'react';
import NavTemplate from '../components/template/NavBar';
import { Container } from 'react-bootstrap';
import certificateimg from '../components/certifacate/Certificate.png'


const Certificate = () => {


    return(
        <div>
            <NavTemplate/>
            <Container className='mt-3 d-flex align-items-center justify-content-center'>
                <img src={certificateimg}/>
            </Container>
        </div>
    )
}

export default Certificate