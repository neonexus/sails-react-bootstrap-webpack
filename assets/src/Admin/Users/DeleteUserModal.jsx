import { useState } from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';

function DeleteUserModal(props) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Modal show={props.show} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    {props.softDelete ? 'Delete User' : 'PERMANENTLY Delete User'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Are you sure you want to delete this user?
                <br />
                {
                    props.softDelete
                        ? <div>(This action can be undone later)</div>
                        : <div>(This is a <strong>PERMANENT</strong> action, and <strong>CAN NOT</strong> be undone!)</div>
                }
                <br />
                <strong>{props.firstName} {props.lastName} ({props.role})</strong>
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={props.onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={
                    () => {
                        setIsLoading(true);
                        props.onAccept(() => setIsLoading(false));
                    }} disabled={isLoading}
                >
                    {isLoading ? 'Working...' : 'Yes, Delete User'}
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
    softDelete: PropTypes.bool.isRequired
};

export default DeleteUserModal;
