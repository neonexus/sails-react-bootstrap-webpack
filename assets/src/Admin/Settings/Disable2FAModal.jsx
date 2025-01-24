import {Button, Form, Modal} from 'react-bootstrap';
import {useState} from 'react';

function Disable2FAModal({api, onCancel, onDisable, show}) {
    if (!api || typeof api.post !== 'function') {
        throw new Error("Invalid or missing 'api' prop. Expected an object with a 'post' method.");
    }
    if (!onCancel || typeof onCancel !== 'function') {
        throw new Error("Invalid or missing 'onCancel' prop. Expected a function.");
    }
    if (!onDisable || typeof onDisable !== 'function') {
        throw new Error("Invalid or missing 'onDisable' prop. Expected a function.");
    }
    if (typeof show !== 'boolean') {
        throw new Error("Invalid or missing 'show' prop. Expected a boolean.");
    }

    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState('');

    function resetState() {
        setOTP('');
        setPassword('');
        setIsLoading(false);
    }

    function handleCancel() {
        resetState();
        onCancel();
    }

    function disable() {
        if (!otp.length) {
            return alert('OTP is required.');
        }

        setIsLoading(true);

        api.post({
            url: '/2fa/disable',
            body: {
                password,
                otp
            }
        }, (body) => {
            if (body.success) {
                alert('2-factor authentication has been disabled.');
                resetState();
                onDisable();
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
        <Modal show={show} backdrop="static">
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
                <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={disable} disabled={isLoading}>Disable</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Disable2FAModal;
