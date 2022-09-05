import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';

function DeleteUserModal(props) {
    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <Modal show={props.show} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    Delete User
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Are you sure you want to delete this user?
                <br />
                <br />
                {props.firstName} {props.lastName} ({props.role})
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={props.onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={() => {setIsLoading(true); props.onAccept(() => setIsLoading(false));}} disabled={isLoading}>
                    {(isLoading) ? 'Loading...' : 'Yes, Delete User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

DeleteUserModal.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
};

export default DeleteUserModal;
