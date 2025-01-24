import {Button, Container} from 'react-bootstrap';
import '../../styles/marketing/marketing.scss';
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
                A React Router Link element will just route back here; since the route doesn't exist in this context.
            */}
            <a href="/admin">
                <Button variant="primary">
                    Admin
                </Button>
            </a>
        </Container>
    );
}

export default Main;
