import React, {useState, useCallback} from 'react';
import {Button, Collapse, Form, Modal, Row} from 'react-bootstrap';

const initialState = {
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

const CreateUserModal = ({ show, onClose, onCreate }) => {
    const [state, setState] = useState(initialState);

    const handleClose = useCallback(() => {
        setState(initialState);
        if (onClose) onClose();
    }, [onClose]);

    const handlePasswordMatching = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            doPasswordsMatch: prevState.password1 === prevState.password2
        }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        setState((prevState) => ({ ...prevState, wasValidated: true, isLoading: true }));

        const isValidPassword =
            state.generatePassword ||
            (state.password1 === state.password2 && state.password1.length > 5);

        if (e.target.checkValidity() && isValidPassword) {
            onCreate(
                {
                    firstName: state.firstName,
                    lastName: state.lastName,
                    email: state.email,
                    role: state.role,
                    generatePassword: state.generatePassword,
                    password: state.password1
                },
                handleClose,
                () => setState((prevState) => ({ ...prevState, isLoading: false }))
            );
        } else {
            setState((prevState) => ({ ...prevState, isLoading: false }));
        }
    }, [state, onCreate, handleClose]);

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Create New User</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit} noValidate validated={state.wasValidated}>
                <Modal.Body>
                    <Row>
                        <Form.Group className="mb-3 col-sm" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter First Name"
                                value={state.firstName}
                                onChange={(e) => setState((prevState) => ({ ...prevState, firstName: e.target.value }))}
                                required
                                autoFocus
                                disabled={state.isLoading}
                            />
                            <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3 col-sm" controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Last Name"
                                value={state.lastName}
                                onChange={(e) => setState((prevState) => ({ ...prevState, lastName: e.target.value }))}
                                required
                                disabled={state.isLoading}
                            />
                            <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email Address"
                            value={state.email}
                            onChange={(e) => setState((prevState) => ({ ...prevState, email: e.target.value }))}
                            required
                            disabled={state.isLoading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {state.isDuplicateEmail ? 'Email is already in-use.' : 'Email address is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            aria-label="Select role"
                            value={state.role}
                            onChange={(e) => setState((prevState) => ({ ...prevState, role: e.target.value }))}
                            disabled={state.isLoading}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="generatePassword">
                        <Form.Check
                            type="checkbox"
                            label="Set Password"
                            checked={!state.generatePassword}
                            onChange={(e) => setState((prevState) => ({ ...prevState, generatePassword: !e.target.checked }))}
                            disabled={state.isLoading}
                        />
                    </Form.Group>

                    <Collapse in={!state.generatePassword}>
                        <div className="mt-3 mb-2">
                            <Form.Group className="mb-3" controlId="password1">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter Password"
                                    value={state.password1}
                                    onChange={(e) => setState((prevState) => ({ ...prevState, password1: e.target.value }))}
                                    className={
                                        state.wasValidated && state.password1.length < 6 ? 'is-invalid' : ''
                                    }
                                    required
                                    disabled={state.isLoading || state.generatePassword}
                                    minLength="6"
                                    maxLength="72"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {state.password1.length
                                        ? 'Password is too short.'
                                        : 'Password is required.'}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="password2">
                                <Form.Label>Verify Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Verify Password"
                                    value={state.password2}
                                    onChange={(e) => setState((prevState) => ({ ...prevState, password2: e.target.value }))}
                                    className={
                                        state.wasValidated &&
                                        state.password1 !== state.password2 &&
                                        state.password2.length
                                            ? 'is-invalid'
                                            : ''
                                    }
                                    required
                                    disabled={state.isLoading || state.generatePassword}
                                    minLength="6"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Passwords do not match.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </Collapse>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <Button variant="secondary" onClick={handleClose} disabled={state.isLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={state.isLoading}>
                        {state.isLoading ? 'Loading...' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateUserModal;
