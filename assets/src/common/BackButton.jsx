import {Button} from 'react-bootstrap';

function BackButton({hist = window.history}) {
    if (!history) {
        console.error('A `history` object is required for BackButton.');

        return 'ERROR!';
    }

    return (
        <Button variant="secondary" className="mb-4" onClick={hist.goBack}>
            <i className="fa fa-chevron-left" /> Back
        </Button>
    );
}

export default BackButton;
