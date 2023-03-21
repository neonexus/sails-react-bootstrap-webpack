import React from 'react';
import PropTypes from 'prop-types';

import {Nav, Navbar, Button} from 'react-bootstrap';
import {NavLink as ReactNavLink} from 'react-router-dom';

import UserContext from '../data/UserContext';

function NavBar(props) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const user = React.useContext(UserContext);

    function closeNavbar() {
        setIsExpanded(false);
    }

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="sm"
            sticky="top"
            className="mb-3 ps-3 pe-3"
            expanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
        >
            <Navbar.Brand>My App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={ReactNavLink} to="/admin/dashboard" onClick={closeNavbar}>Home</Nav.Link>
                    {
                        (user.info.role === 'admin')
                            ? <Nav.Link as={ReactNavLink} to="/admin/users" onClick={closeNavbar}>Users</Nav.Link>
                            : null
                    }
                    <Nav.Link as={ReactNavLink} to="/admin/404" onClick={closeNavbar}>404 Page</Nav.Link>
                    <Nav.Link as={ReactNavLink} to="/admin/settings" onClick={closeNavbar}>Settings</Nav.Link>
                </Nav>

                {
                    user.isLoggedIn ?
                        <>
                            <span className="text-white d-none d-md-block">Welcome, {user.info.firstName} &nbsp; &nbsp; </span>
                            <Button variant="danger" onClick={() => props.handleLogout()} size="sm" className="mt-2 mt-sm-0 mb-2 mb-sm-0">Logout</Button>
                        </>
                        : null
                }
            </Navbar.Collapse>
        </Navbar>
    );
}

NavBar.propTypes = {
    handleLogout: PropTypes.func.isRequired
};

export default NavBar;
