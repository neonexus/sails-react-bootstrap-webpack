import { useState } from 'react';
import PropTypes from 'prop-types';

import {Button, Form, Modal, Spinner} from 'react-bootstrap';

function ChangePasswordModal(props) {
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

    function onCancel() {
        resetState();

        props.onCancel();
    }

    function onUpdate() {
        setIsLoading(true);

        props.api.post({
            url: '/password',
            body: {
                currentPassword: current,
                newPassword: newPass,
                confirmPassword: confPass
            }
        }, (body) => {
            setIsLoading(false);
            alert('Password updated successfully.');
            props.onUpdate();
            resetState();
        }, (err, body) => {
            console.error(err);
            alert('The following errors were found:\n\n' + body.errorMessages.join('\n'));
            setIsLoading(false);
        });
    }

    return (
        <Modal show={props.show} backdrop="static" size="md">
            <Form onSubmit={(e) => {e.preventDefault(); onUpdate();}}>
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
                    <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
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

ChangePasswordModal.propTypes = {
    api: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default ChangePasswordModal;
