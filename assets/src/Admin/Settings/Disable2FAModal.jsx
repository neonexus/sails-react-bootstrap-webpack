import {Button, Form, Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {useState} from 'react';

function Disable2FAModal(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState('');

    function resetState() {
        setOTP('');
        setPassword('');
        setIsLoading(false);
    }

    function onCancel() {
        resetState();
        props.onCancel();
    }

    function disable() {
        if (!otp.length) {
            return alert('OTP is required.');
        }

        setIsLoading(true);

        props.api.post({
            url: '/2fa/disable',
            body: {
                password,
                otp
            }
        }, (body) => {
            if (body.success) {
                alert('2-factor authentication has been disabled.');
                resetState();
                props.onDisable();
            } else {
                alert('Unknown error.');
                console.error(body);
                setIsLoading(false);
            }
        }, (err, res) => {
            alert(res.errorMessages);
            setIsLoading(false);
        });
    }

    return (
        <Modal show={props.show} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    Disable 2-Factor Authentication
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Are you absolutely positive you want to disable 2-Factor Authentication? This will make your account more vulnerable.</p>
                <p>To continue, you must enter your current password, and either a one-time passcode or a backup code.</p>

                <Form onSubmit={(e) => {e.preventDefault(); disable();}}>
                    <Form.FloatingLabel label="Current Password" controlId="otp" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Current Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </Form.FloatingLabel>

                    <Form.FloatingLabel label="2FA Code" controlId="otp">
                        <Form.Control
                            type="string"
                            maxLength="10"
                            placeholder="2FA Code"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </Form.FloatingLabel>
                </Form>
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={disable} disabled={isLoading}>Disable</Button>
            </Modal.Footer>
        </Modal>
    );
}

Disable2FAModal.propTypes = {
    api: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDisable: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default Disable2FAModal;
