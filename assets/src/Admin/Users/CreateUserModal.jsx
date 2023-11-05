import { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Collapse, Form, Modal, Row} from 'react-bootstrap';

class CreateUserModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            generatePassword: true,
            wasValidated: false,
            firstName: '',
            lastName: '',
            email: '',
            role: 'user',
            password1: '',
            password2: '',
            isDuplicateEmail: false,
            doPasswordsMatch: true,
            isLoading: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordMatching = this.handlePasswordMatching.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({wasValidated: true, isLoading: true});

        if (e.target.checkValidity() && (this.state.generatePassword || (this.state.password1 === this.state.password2 && this.state.password1.length > 5))) {
            this.props.onCreate(
                {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    role: this.state.role,
                    generatePassword: this.state.generatePassword,
                    password: this.state.password1
                },
                this.handleClose,
                () => this.setState({isLoading: false})
            );
        } else {
            this.setState({isLoading: false});
        }
    }

    handleClose(onClose) {
        if (!onClose) {
            onClose = _.noop;
        }

        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            role: 'user',
            password1: '',
            password2: '',
            generatePassword: true,
            wasValidated: false,
            isLoading: false
        }, onClose);
    }

    handlePasswordMatching() {
        if (this.state.doPasswordsMatch && this.state.password1 !== this.state.password2) {
            this.setState({doPasswordsMatch: false});
        } else if (!this.state.doPasswordsMatch && this.state.password1 === this.state.password2) {
            this.setState({doPasswordsMatch: true});
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={() => this.handleClose(this.props.onClose)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Create New User
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={(e) => this.handleSubmit(e)} validated={this.state.wasValidated} noValidate>
                    <Modal.Body>
                        <Row>
                            <Form.Group className="mb-3 col-sm" controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={this.state.firstName}
                                    onChange={(e) => this.setState({firstName: e.target.value})}
                                    required
                                    autoFocus
                                    disabled={this.state.isLoading}
                                />
                                <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3 col-sm" controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={this.state.lastName}
                                    onChange={(e) => this.setState({lastName: e.target.value})}
                                    required
                                    disabled={this.state.isLoading}
                                />
                                <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email Address"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                                required
                                disabled={this.state.isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {
                                    (this.state.isDuplicateEmail) ? 'Email is already in-use.' : 'Email address is required.'
                                }
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                aria-label="Select role"
                                defaultValue="user"
                                className="prevent-validation"
                                onChange={(e) => this.setState({role: e.target.value})}
                                disabled={this.state.isLoading}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="generatePassword">
                            <Form.Check
                                type="checkbox"
                                label="Set Password"
                                onChange={(e) => this.setState({generatePassword: !e.target.checked})}
                                className="prevent-validation"
                                disabled={this.state.isLoading}
                            />
                        </Form.Group>

                        <Collapse in={!this.state.generatePassword}>
                            <div className="mt-3 mb-2">
                                <Form.Group className="mb-3" controlId="password1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Password"
                                        onChange={(e) => this.setState({password1: e.target.value})}
                                        className={
                                            (this.state.wasValidated && this.state.password1.length < 6)
                                                ? 'is-invalid'
                                                : null
                                        }
                                        required
                                        disabled={this.state.isLoading || this.state.generatePassword}
                                        minLength="6"
                                        maxLength="72"
                                    />
                                    <Form.Control.Feedback type="invalid" className={(!this.state.wasValidated || this.state.password1.length > 5) ? 'd-none' : null}>
                                        {
                                            (this.state.password1.length)
                                                ? 'Password is too short.'
                                                : 'Password is required.'
                                        }
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="password2">
                                    <Form.Label>Verify Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Verify Password"
                                        onChange={(e) => this.setState({password2: e.target.value})}
                                        className={
                                            (this.state.wasValidated && this.state.password1 !== this.state.password2 && this.state.password2.length)
                                                ? 'is-invalid'
                                                : null
                                        }
                                        required
                                        disabled={this.state.isLoading || this.state.generatePassword}
                                        minLength="6"
                                    />
                                    {
                                        (this.state.wasValidated && this.state.password1.length && this.state.password2.length)
                                            ? <Form.Control.Feedback type="invalid">Passwords do not match.</Form.Control.Feedback>
                                            : null
                                    }
                                </Form.Group>
                            </div>
                        </Collapse>
                    </Modal.Body>

                    <Modal.Footer className="justify-content-between">
                        <Button variant="secondary" onClick={() => this.handleClose(this.props.onClose)} disabled={this.state.isLoading}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={this.state.isLoading}>
                            {this.state.isLoading ? 'Loading...' : 'Create'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

CreateUserModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default CreateUserModal;
