import React from 'react';
import PropTypes from 'prop-types';

import {Nav, Navbar, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {UserConsumer} from '../data/userContext';

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };

        this.closeNavbar = this.closeNavbar.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(userContext) {
        this.props.api.get('/logout', () => {
            userContext.logout();
        });
    }

    closeNavbar() {
        this.setState({isExpanded: false});
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="sm" sticky="top" expanded={this.state.isExpanded} onToggle={() => this.setState((current) => ({isExpanded: !current.isExpanded}))}>
                <Navbar.Brand>My App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/admin/dashboard" onClick={this.closeNavbar}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/admin/upgrade" onClick={this.closeNavbar}>Upgrade</Nav.Link>
                    </Nav>

                    <UserConsumer>
                        {
                            (userContext) => (
                                <Button variant="danger" onClick={() => this.handleLogout(userContext)}>Logout</Button>
                            )
                        }
                    </UserConsumer>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

NavBar.propTypes = {
    api: PropTypes.object.isRequired
};

export default NavBar;
