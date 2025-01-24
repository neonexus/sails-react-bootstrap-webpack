import {useState} from 'react';
import {Button, Form, Modal, Spinner} from 'react-bootstrap';

/**
 * Change Password Modal
 *
 * @param {object} api
 * @param {function} onCancel
 * @param {function} onUpdate
 * @param {boolean} show
 *
 * @returns {JSX.Element}
 */
function ChangePasswordModal({api, onCancel, onUpdate, show}) {
    if (api === undefined || onCancel === undefined || onUpdate === undefined || show === undefined) {
        throw new Error('`api`, `onCancel`, `onUpdate`, and `show` are required parameters for ChangePasswordModal.');
    }

    if (typeof onCancel !== 'function') {
        throw new Error('`onCancel` must be a function in ChangePasswordModal.');
    }

    if (typeof onUpdate !== 'function') {
        throw new Error('`onUpdate` must be a function in ChangePasswordModal.');
    }

    if (typeof show !== 'boolean') {
        throw new Error('`show` must be a boolean in ChangePasswordModal.');
    }

    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confPass, setConfPass] = useState('');

    function resetState() {
        setCurrent('');
        setNewPass('');
        setConfPass('');
        setIsLoading(false);
    }

    function onCancelHandler() {
        resetState();

        onCancel();
    }

    function onUpdateHandler() {
        setIsLoading(true);

        api.post({
            url: '/password',
            body: {
                currentPassword: current,
                newPassword: newPass,
                confirmPassword: confPass
            }
        }, (body) => {
            setIsLoading(false);
            alert('Password updated successfully.');
            onUpdate();
            resetState();
        }, (err, body) => {
            console.error(err);
            alert('The following errors were found:\n\n' + body.errorMessages.join('\n'));
            setIsLoading(false);
        });
    }

    return (
        <Modal show={show} backdrop="static" size="md">
            <Form onSubmit={(e) => {e.preventDefault(); onUpdateHandler();}}>
                <Modal.Header>
                    <Modal.Title>
                        Change Password
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.FloatingLabel label="Current Password" controlId="currentPassword" className="mb-3">
                        <Form.Control type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current Password" disabled={isLoading} required autoFocus />
                    </Form.FloatingLabel>
                    <Form.FloatingLabel label="New Password" controlId="newPassword" className="mb-3">
                        <Form.Control type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" disabled={isLoading} required />
                    </Form.FloatingLabel>
                    <Form.FloatingLabel label="Confirm Password" controlId="confirmPassword">
                        <Form.Control type="password" value={confPass} onChange={(e) => setConfPass(e.target.value)} placeholder="Confirm Password" disabled={isLoading} required />
                    </Form.FloatingLabel>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <Button variant="secondary" onClick={onCancelHandler} disabled={isLoading}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {
                            (isLoading)
                                ? <Spinner variant="outline" size="sm" />
                                : 'Update Password'
                        }
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ChangePasswordModal;
