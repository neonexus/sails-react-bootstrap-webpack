import React from 'react';
import PropTypes from 'prop-types';

import {UserConsumer} from '../data/userContext';

import {Row, Button, Form} from 'react-bootstrap';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: localStorage.getItem('email') || '',
            password: '',
            autoFocusPassword: false
        };

        if (this.state.email !== '') {
            this.state.autoFocusPassword = true;
        }

        this.goBack = this.goBack.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    goBack() {
        // const dest = this.props.location.state.from.pathname || '/admin';
        //
        // this.props.location.history.push(dest);
    }

    handleLogin(e, done) {
        e.preventDefault();

        localStorage.setItem('email', this.state.email);

        this.props.api.post({
            url: '/login',
            body: {
                email: this.state.email,
                password: this.state.password
            }
        }, (body) => {
            if (body.success) {
                return done({email: this.state.email});
            }

            // should not happen
            alert('Bad email / password.');
        }, (err, resp) => {
            console.error(err.response);

            const errMessage = (resp.errors && resp.errors.problems)
                               ? resp.errors.problems.join('\n')
                               : resp.errorMessages.join('\n');

            alert(errMessage);
        });

        return false;
    }

    handleEmail(e) {
        this.setState({email: e.target.value});
    }

    handlePassword(e) {
        this.setState({password: e.target.value});
    }

    render() {
        return (
            <UserConsumer>
                {
                    (userContext) => (
                        <div id="main-wrapper" className="container">
                            <h2 className="text-center">Admin</h2>
                            {
                                userContext.isLoggedIn &&
                                <div>You are logged in</div>
                            }
                            {
                                !userContext.isLoggedIn &&
                                <div className="row justify-content-center">
                                    <Form onSubmit={(e) => this.handleLogin(e, userContext.login)} className="col-sm-5">
                                        <h3>Login</h3>
                                        <div className="pb-2">
                                            <Form.Control
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={this.state.email}
                                                name="email"
                                                onChange={this.handleEmail}
                                                autoFocus={!this.state.autoFocusPassword}
                                            />
                                        </div>
                                        <div className="pb-4">
                                            <Form.Control
                                                type="password"
                                                className="form-control"
                                                placeholder="Password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handlePassword}
                                                autoFocus={this.state.autoFocusPassword}
                                            />
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
                                                If you need to create your first admin user, run this in your terminal: <div style="">sails run create-admin</div>
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
