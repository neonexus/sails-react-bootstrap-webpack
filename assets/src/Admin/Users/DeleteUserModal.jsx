import {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';

function DeleteUserModal({
    firstName = '',
    lastName = '',
    onAccept = () => {},
    onCancel = () => {},
    role = '',
    show = false,
    softDelete = true
}) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Modal show={show} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    {softDelete ? 'Delete User' : 'PERMANENTLY Delete User'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Are you sure you want to delete this user?
                <br />
                {
                    softDelete
                        ? <div>(This action can be undone later)</div>
                        : <div>(This is a <strong>PERMANENT</strong> action, and <strong>CAN NOT</strong> be undone!)</div>
                }
                <br />
                <strong>{firstName} {lastName} ({role})</strong>
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={
                    () => {
                        setIsLoading(true);
                        onAccept(() => setIsLoading(false));
                    }} disabled={isLoading}
                >
                    {isLoading ? 'Working...' : 'Yes, Delete User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteUserModal;
