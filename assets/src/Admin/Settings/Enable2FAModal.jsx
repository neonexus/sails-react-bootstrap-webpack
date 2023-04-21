import {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Collapse, Fade, Form, Modal} from 'react-bootstrap';

function Enable2FAModal(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState('');

    const [QR, setQR] = useState(null);
    const [tfaCode, setTfaCode] = useState(null);
    const [backupCodes, setBackupCodes] = useState([]);

    function resetState() {
        setCurrentPage(0);
        setOTP('');
        setPassword('');
        setShowCode(false);
        setShowBackupCodes(false);
        setIsLoading(false);
    }

    function onCancel() {
        props.onCancel();
        resetState();
    }

    function getCode() {
        props.api.post({
            url: '/2fa/enable'
        }, (body) => {
            setQR(body.image);
            setTfaCode(body.secret);
            setCurrentPage(1);
            setIsLoading(false);
        }, (err, res) => {
            alert(res.errorMessages);
            setIsLoading(false);
        });
    }

    function validateCode() {
        props.api.post({
            url: '/2fa/finalize',
            body: {
                password,
                otp
            }
        }, (body) => {
            setBackupCodes(body.backupTokens);
            setCurrentPage(2);
        }, (err, res) => {
            alert(res.errorMessages);
            setIsLoading(false);
        });
    }

    function next() {
        const nextPage = currentPage + 1;

        switch (nextPage) {
            case 0:
                setCurrentPage(nextPage);
                break;
            case 1:
                setIsLoading(true);
                getCode();
                break;
            case 2:
                if (!password.length) {
                    return alert('Current password is required.');
                }

                if (!otp.length) {
                    alert('One-time password is required.');
                } else {
                    setIsLoading(true);
                    validateCode();
                }
                break;
            case 3:
                if (confirm('Are you sure you have saved your backup codes? They won\'t be shown again.')) {
                    props.onSuccess();
                    resetState();
                }
                break;
        }
    }

    function showBackups() {
        setShowBackupCodes(true);
        setIsLoading(false);
    }

    return (
        <Modal show={props.show} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    Enable 2-Factor Authentication
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Collapse in={(currentPage === 0)} unmountOnExit>
                    <div>
                        <p>Enabling 2-Factor Authentication will help us secure your account against unauthorized usage.</p>

                        <p>In-order to continue, you must use either a capable password manager like 1Password, or an authenticator app like Google Authenticator.</p>
                    </div>
                </Collapse>
                <Collapse in={(currentPage === 1)} unmountOnExit>
                    <div className="text-center">
                        <h3 className="mb-0">Scan this code</h3>
                        {/* The width and height here are from what the QR code generator defaults too. */}
                        <img src={QR} className="mb-3" />

                        <Fade in={!showCode} className="position-absolute w-100 start-0 mt-n2" unmountOnExit>
                            <p>Problems with the code? Want to do it manually? <Button className="p-0" variant="link" onClick={() => setShowCode(true)}>Click here</Button></p>
                        </Fade>
                        <Fade in={showCode} className="position-absolute w-100 start-0 mt-n3" unmountOnExit>
                            <p>Enter manually:<br /><span className="ls-15">{tfaCode}</span></p>
                        </Fade>

                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            next();
                        }}>
                            <Form.FloatingLabel label="Current Password" controlId="pass" className="mt-5">
                                <Form.Control
                                    type="password"
                                    maxLength="70"
                                    placeholder="Current Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </Form.FloatingLabel>

                            <Form.FloatingLabel label="2FA Code" controlId="otp" className="mt-3">
                                <Form.Control
                                    type="number"
                                    maxLength="10"
                                    pattern="[0-9]*"
                                    placeholder="2FA Code"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </Form.FloatingLabel>
                        </Form>
                    </div>
                </Collapse>
                <Collapse in={(currentPage === 2)} unmountOnExit>
                    <div>
                        <h3>Backup Codes</h3>
                        <p>In the event you can't use a one-time password, you can one of the following backup codes. Each code is valid only once.</p>

                        <p>Make sure to save these in a safe place, as they WON'T be displayed again!</p>

                        <p className="mb-3"><strong>THESE CODES NEVER EXPIRE! IF SOMEONE HAS ONE OF THESE CODES AND YOUR PASSWORD, THEY HAVE ACCESS TO YOUR ACCOUNT!</strong></p>

                        <Collapse in={!showBackupCodes} unmountOnExit>
                            <div className="text-center">
                                <Button variant="primary" onClick={showBackups}>Show Backup Codes</Button>
                            </div>
                        </Collapse>

                        <Collapse in={showBackupCodes} unmountOnExit>
                            <div className="text-center">
                                <ul className="d-inline-block me-1">
                                    {
                                        backupCodes.map((code, index) => (index < 5) && (<li key={code} className="text-start ls-15">{code}</li>))
                                    }
                                </ul>
                                <ul className="d-inline-block ms-1">
                                    {
                                        backupCodes.map((code, index) => (index >= 5) && (<li key={code} className="text-start ls-15">{code}</li>))
                                    }
                                </ul>
                            </div>
                        </Collapse>
                    </div>
                </Collapse>
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={onCancel} disabled={isLoading} className={(currentPage > 1) ? 'invisible' : ''}>Cancel</Button>
                <Button variant="primary" onClick={next} disabled={isLoading} hidden={currentPage === 2}>Next</Button>
                <Button variant="secondary" onClick={next} disabled={isLoading} hidden={currentPage !== 2}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

Enable2FAModal.propTypes = {
    api: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default Enable2FAModal;
