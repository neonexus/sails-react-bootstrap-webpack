import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';

function Enable2FAModal(props) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);

    function resetState() {

    }

    return (
        <Modal show={props.show} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    Enable 2-Factor Authentication
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Enabling 2-Factor Authentication will help us secure your account against unauthorized usage.<br /><br />

                In-order to continue, you must use either a capable password manager like 1Password, or an authenticator app like Google Authenticator.
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={props.onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="primary">Next</Button>
            </Modal.Footer>
        </Modal>
    );
}

Enable2FAModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default Enable2FAModal;
