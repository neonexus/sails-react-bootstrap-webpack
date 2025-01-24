import {Badge, Button, Col, Row} from 'react-bootstrap';
import {useContext, useState} from 'react';
import UserContext from '../../data/UserContext';
import ChangePasswordModal from './ChangePasswordModal';
import Enable2FAModal from './Enable2FAModal';
import Disable2FAModal from './Disable2FAModal';

function SecuritySection({api}) {
    if (!api || typeof api !== 'object') {
        throw new Error('Invalid or missing `api` prop. Expected an object.');
    }

    const user = useContext(UserContext);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showEnableOTP, setShowEnableOTP] = useState(false);
    const [showDisableOTP, setShowDisableOTP] = useState(false);

    function handleEnableOTP() {
        if (user && user.login && user.info) {
            user.login({ ...user.info, _isOTPEnabled: true });
            setShowEnableOTP(false);
        } else {
            console.error('User context is invalid or missing required properties.');
        }
    }

    function handleDisableOTP() {
        if (user && user.login && user.info) {
            user.login({ ...user.info, _isOTPEnabled: false });
            setShowDisableOTP(false);
        } else {
            console.error('User context is invalid or missing required properties.');
        }
    }

    return (
        <>
            <h2 className="mb-4 text-center">Security Settings</h2>
            <Row className="m-0 pt-2" style={{ border: '1px solid #ddd', borderWidth: '1px 0 0 0', padding: '0 1rem' }}>
                <Col>
                    <h3 className="pt-2">Change Password</h3>
                    <p>Always a good idea to rotate your passwords.</p>
                </Col>
                <Col className="pt-4">
                    <Button variant="secondary" className="float-end" onClick={() => setShowChangePassword(true)}>Change Password</Button>
                </Col>
            </Row>
            <Row className="m-0 pt-2" style={{ border: '1px solid #ddd', borderWidth: '1px 0 1px 0', padding: '0 1rem' }}>
                <Col>
                    <h3 className="pt-2">2-Factor Authentication {user.info._isOTPEnabled ? <Badge bg="success" style={{ scale: '.65', transform: 'translateY(-5px)' }}>Enabled</Badge> : <Badge bg="danger" style={{ scale: '.65', transform: 'translateY(-5px)' }}>Disabled</Badge>}</h3>
                    {user.info._isOTPEnabled ? <p className="m-0 pb-3">Nice! Your account security is even stronger, because 2FA is enabled.</p> : <p>It is highly recommended to enable 2FA to increase security with your account.</p>}
                </Col>
                <Col className="pt-4">
                    {user.info._isOTPEnabled ? <Button variant="danger" className="float-end" onClick={() => setShowDisableOTP(true)}>Disable 2FA</Button> : <Button variant="success" className="float-end" onClick={() => setShowEnableOTP(true)}>Enable 2FA</Button>}
                </Col>
            </Row>
            <ChangePasswordModal api={api} show={showChangePassword} onCancel={() => setShowChangePassword(false)} onUpdate={() => setShowChangePassword(false)} />
            <Enable2FAModal api={api} show={showEnableOTP} onCancel={() => setShowEnableOTP(false)} onSuccess={handleEnableOTP} />
            <Disable2FAModal api={api} show={showDisableOTP} onCancel={() => setShowDisableOTP(false)} onDisable={handleDisableOTP} />
        </>
    );
}

export default SecuritySection;
