import React, {lazy} from 'react';
import PropTypes from 'prop-types';

import UserContext from '../../data/UserContext';

import {Badge, Button, Col, Form, Row, Tab, Tabs} from 'react-bootstrap';

const Enable2FAModal = lazy(() => import('./Enable2FAModal'));
const ChangePasswordModal = lazy(() => import('./ChangePasswordModal'));

function Settings(props) {
    const user = React.useContext(UserContext);

    const [activeTab, setActiveTab] = React.useState('profile');
    const [isLoading, setIsLoading] = React.useState(false);
    const [firstName, setFirstName] = React.useState(user.info.firstName);
    const [lastName, setLastName] = React.useState(user.info.lastName);
    const [email, setEmail] = React.useState(user.info.email);

    const [showChangePassword, setShowChangePassword] = React.useState(false);
    const [showEnableOTP, setShowEnableOTP] = React.useState(false);

    return (
        <>
            <h1>Settings</h1>
            <Tabs className="mb-3" onSelect={(tab) => (tab !== activeTab) ? setActiveTab(tab) : null}>
                <Tab title="Profile" eventKey="profile" disabled={isLoading}>
                    <h2 className="mb-3">Edit Profile</h2>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Row className="ms-0 me-0 mb-2">
                            <Form.FloatingLabel label="First Name" controlId="firstName" className="col-6 ps-0">
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </Form.FloatingLabel>
                            <Form.FloatingLabel label="Last Name" controlId="firstName" className="col-6 p-0">
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </Form.FloatingLabel>
                        </Row>
                        <Form.FloatingLabel label="Email" controlId="email" className="mb-4">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.FloatingLabel>
                        <Button type="submit" onClick={() => alert('Not done yet')}>Save Changes</Button>
                    </Form>
                </Tab>
                <Tab title="Security" eventKey="security" disabled={isLoading}>
                    <h2 className="mb-4">Security Settings</h2>
                    <Row className="m-0 pt-2" style={{border: '1px solid #ddd', borderWidth: '1px 0 0 0'}}>
                        <Col>
                            <h3>Change Password</h3>
                            <p>Always a good idea to rotate your passwords.</p>
                        </Col>
                        <Col className="pt-3">
                            <Button variant="secondary" className="float-end" onClick={() => setShowChangePassword(true)}>Change Password</Button>
                        </Col>
                    </Row>
                    <Row className="m-0 pt-2" style={{border: '1px solid #ddd', borderWidth: '1px 0 1px 0'}}>
                        <Col>
                            <h3>
                                2-Factor Authentication
                                {
                                    (user.info._isOTPEnabled)
                                        ? <Badge bg="success" style={{scale: '.65', transform: 'translateY(-5px)'}}>Enabled</Badge>
                                        : <Badge bg="danger" style={{scale: '.65', transform: 'translateY(-5px)'}}>Disabled</Badge>
                                }
                            </h3>
                            {
                                (user.info._isOTPEnabled)
                                    ? <p className="m-0">Nice! Your account security is even stronger, because 2FA is enabled.</p>
                                    : <p>It is highly recommended to enable 2FA to increase security with your account.</p>
                            }

                            {
                                (user.info._isOTPEnabled)
                                    ? <Button variant="link" className="ps-0">Generate new backup codes</Button>
                                    : null
                            }
                        </Col>
                        <Col className="pt-3">
                            {
                                (user.info._isOTPEnabled)
                                    ? <Button variant="danger" className="float-end">Disable 2-Factor Auth</Button>
                                    : <Button variant="success" className="float-end" onClick={() => setShowEnableOTP(true)}>Enable 2-Factor Auth</Button>
                            }
                        </Col>
                    </Row>
                </Tab>
            </Tabs>

            <ChangePasswordModal api={props.api} show={showChangePassword} onCancel={() => setShowChangePassword(false)} onUpdate={() => setShowChangePassword(false)} />
            <Enable2FAModal show={showEnableOTP} onCancel={() => setShowEnableOTP(false)} />
        </>
    );
}

Settings.propTypes = {
    api: PropTypes.object.isRequired
};

export default Settings;
