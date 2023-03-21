import {Button} from 'react-bootstrap';

function PageNotFound() {
    return (
        <>
            <h1>Page Not Found</h1>
            <div>
                The page you have requested does not exist. Maybe go back and try again?
                <br />
                <br />
                <Button variant="outline-secondary" onClick={() => window.history.back()}>&#8678; Go Back</Button>
            </div>
        </>
    );
}

export default PageNotFound;
