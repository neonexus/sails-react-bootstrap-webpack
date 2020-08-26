import React from 'react';
import {Button, Container} from 'react-bootstrap';
import img from '../../images/sails-logo.png';

function Main() {
    return (
        <Container id="main-wrapper" style={{paddingTop: '50px'}}>
            <div className="text-center">
                <img src={img} alt="Sails Logo" />
            </div>
            <h1>Main "application"</h1>
            <div>The marketing site, if you will.</div>
            <br />
            <br />
            {/*
                This MUST be a hard HTML link, and NOT a React Router Link, because this is a completely different React app.
                A React Router Link will just route back here.
            */}
            <a href="/admin">
                <Button variant="info">
                    Admin
                </Button>
            </a>
        </Container>
    );
}

export default Main;
