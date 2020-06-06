import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

function BackButton(props) {
    return (
        <Button variant="secondary" className="mb-4" onClick={props.history.goBack}>
            <i className="fa fa-chevron-left" /> Back
        </Button>
    );
}

BackButton.propTypes = {
    history: PropTypes.object.isRequired
};

export default BackButton;
