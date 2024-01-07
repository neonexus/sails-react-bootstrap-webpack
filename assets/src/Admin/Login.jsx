import { Component } from 'react';
import PropTypes from 'prop-types';

import {UserConsumer} from '../data/UserContext';
import defaultAPIErrorHandler from '../data/defaultAPIErrorHandler';

import {Row, Button, Form} from 'react-bootstrap';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: localStorage.getItem('email') || '',
            password: '',
            otp: '',
            autoFocusPassword: false
        };

        if (this.state.email !== '') {
            this.state.autoFocusPassword = true;
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleOTP = this.handleOTP.bind(this);
    }

    handleLogin(e, done, rememberMe) {
        e.preventDefault();

        if (rememberMe) {
            localStorage.setItem('email', this.state.email);
        } else {
            localStorage.removeItem('email');
        }

        this.props.api.post({
            url: '/login',
            body: {
                email: this.state.email,
                password: this.state.password,
                otp: this.state.otp
            }
        }, (body) => {
            if (body.success) {
                return done(body.user);
            }

            // This should not happen, as the `defaultAPIErrorHandler` should display the error from the server.
            alert('Unknown error. Please try again. If this error persists, please contact support.');
            console.error('Something is wrong in the handleLogin API post...');
        }, defaultAPIErrorHandler);

        return false;
    }

    handleEmail(e) {
        this.setState({email: e.target.value});
    }

    handlePassword(e) {
        this.setState({password: e.target.value});
    }

    handleOTP(e) {
        this.setState({otp: e.target.value});
    }

    render() {
        return (
            <UserConsumer>
                {
                    (userContext) => (
                        <div id="main-wrapper" className="container">
                            <br />
                            <br />
                            <br />
                            <h2 className="text-center">Admin</h2>
                            {
                                userContext.isLoggedIn ? <div>You are logged in</div> : null
                            }
                            {
                                !userContext.isLoggedIn &&
                                <div className="row justify-content-center">
                                    <Form onSubmit={(e) => this.handleLogin(e, userContext.login, userContext.isRememberMeOn)} className="col-sm-5">
                                        <h3>Login</h3>
                                        <div className="pb-2">
                                            <Form.FloatingLabel label="Email" controlId="email">
                                                <Form.Control
                                                    type="email"
                                                    value={this.state.email}
                                                    placeholder="someone@somewhere.com" // This is required, even if it isn't shown, because of the CSS effect.
                                                    onChange={this.handleEmail}
                                                    autoFocus={!this.state.autoFocusPassword}
                                                    required
                                                />
                                            </Form.FloatingLabel>
                                        </div>
                                        <div className="pb-2">
                                            <Form.FloatingLabel label="Password" controlId="password">
                                                <Form.Control
                                                    type="password"
                                                    maxLength="70"
                                                    placeholder="Password"
                                                    value={this.state.password}
                                                    onChange={this.handlePassword}
                                                    autoFocus={this.state.autoFocusPassword}
                                                    required
                                                />
                                            </Form.FloatingLabel>
                                        </div>
                                        <div className="pb-4">
                                            <Form.FloatingLabel label="One-Time Password" controlId="otp">
                                                <Form.Control
                                                    type="text"
                                                    maxLength="8"
                                                    placeholder="One-Time Password"
                                                    value={this.state.otp}
                                                    onChange={this.handleOTP}
                                                />
                                                <Form.Text muted className="ms-2">Required only if enabled.</Form.Text>
                                            </Form.FloatingLabel>
                                        </div>
                                        <div className="pb-4">
                                            <Form.Check
                                                type="checkbox"
                                                id="rememberMe"
                                                defaultChecked={userContext.isRememberMeOn}
                                                onChange={() => userContext.setRememberMe(!userContext.isRememberMeOn)}
                                                label="Remember Me"
                                            />
                                        </div>
                                        <div>
                                            <Button type="submit" variant="primary">Login</Button>
                                        </div>
                                        <br />
                                        <br />
                                        <Row>
                                            <Form.Text id="adminHelpBlock" muted>
                                                If you need to create your first admin user, run this in your terminal:
                                                <br />
                                                <code>npm run create:admin</code>
                                            </Form.Text>
                                        </Row>
                                    </Form>
                                </div>
                            }
                        </div>
                    )
                }
            </UserConsumer>
        );
    }
}

Login.propTypes = {
    api: PropTypes.object.isRequired
};

export default Login;
