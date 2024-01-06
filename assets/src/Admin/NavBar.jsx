import {useState, useContext, useEffect} from 'react';
import PropTypes from 'prop-types';

import {Button, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {NavLink as ReactNavLink} from 'react-router-dom';

import UserContext from '../data/UserContext';

function scrollListener() {
    const nav = document.querySelector('nav');

    if (nav) {
        if (window.scrollY > 0 && window.scrollY < 26) {
            nav.classList.add('shadow-sm');
            nav.classList.remove('shadow');
        } else if (window.scrollY > 25) {
            nav.classList.add('shadow');
            nav.classList.remove('shadow-sm');
        } else {
            nav.classList.remove('shadow');
            nav.classList.remove('shadow-sm');
        }
    }
}

function NavBar(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const user = useContext(UserContext);

    const [lightOrDark, setLightOrDark] = useState(window.localStorage.getItem('theme'));
    let lightDarkAutoClass = 'bi-circle-half';

    if (lightOrDark === 'dark') {
        lightDarkAutoClass = 'bi-moon-fill';
    } else if (lightOrDark === 'light') {
        lightDarkAutoClass = 'bi-sun-fill';
    }

    function closeNavbar() {
        setIsExpanded(false);
    }

    function switchTheme(e) {
        const newTheme = e.target.getAttribute('data-theme-set');

        setLightOrDark(newTheme);
        window.localStorage.setItem('theme', newTheme);

        tellBootstrapAboutTheme(newTheme);
    }

    function tellBootstrapAboutTheme(newTheme) {
        if (newTheme === 'light' || newTheme === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', newTheme);
        } else {
            document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
    }

    function themeListener() {
        tellBootstrapAboutTheme(lightOrDark);
    }

    useEffect(() => {
        window.addEventListener('scroll', scrollListener);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeListener);

        // If we don't do this, and the page loads with "auto" and the user wants it dark, it won't change.
        tellBootstrapAboutTheme(lightOrDark);

        return () => {
            window.removeEventListener('scroll', scrollListener);
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeListener);
        };
    });

    return (
        <Navbar
            bg="body-tertiary"
            expand="sm"
            sticky="top"
            className="mb-3 ps-3 pe-3 border-bottom"
            expanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
        >
            <Navbar.Brand>{appConfig.appName}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" navbarScroll>
                    <Nav.Link as={ReactNavLink} to="/admin/dashboard" onClick={closeNavbar}>Home</Nav.Link>
                    {
                        (user.info.role === 'admin')
                            ? <Nav.Link as={ReactNavLink} to="/admin/users" onClick={closeNavbar}>Users</Nav.Link>
                            : null
                    }
                    {
                        (user.isLoggedIn)
                            ? <>
                                <Nav.Link as={ReactNavLink} to="/admin/404" onClick={closeNavbar}>404 Page</Nav.Link>
                                <NavDropdown title="Settings" id="basic-nav-dropdown">
                                    <NavDropdown.Item className="ps-3 pe-3" as={ReactNavLink} to="/admin/settings/profile" onClick={closeNavbar}><i className="bi bi-person-fill" /> Profile</NavDropdown.Item>
                                    <NavDropdown.Item className="ps-3 pe-3" as={ReactNavLink} to="/admin/settings/security" onClick={closeNavbar}><i className="bi bi-shield-lock-fill" /> Security</NavDropdown.Item>
                                </NavDropdown>
                            </>
                            : null
                    }
                </Nav>

                {
                    user.isLoggedIn ?
                        <>
                            <Navbar.Text>Welcome, {user.info.firstName} &nbsp; &nbsp; </Navbar.Text>
                            <Button variant="danger" onClick={() => props.handleLogout()} size="sm" className="mt-2 mt-sm-0 mb-2 mb-sm-0">Logout</Button>
                        </>
                        : null
                }

                <NavDropdown title={<i className={'bi ' + lightDarkAutoClass} />} id="light-or-dark-toggle" className="ms-3 right-align-menu">
                    <NavDropdown.Item className="bi bi-sun-fill" active={lightOrDark === 'light'} data-theme-set="light" onClick={switchTheme}>Light</NavDropdown.Item>
                    <NavDropdown.Item className="bi bi-moon-fill" active={lightOrDark === 'dark'} data-theme-set="dark" onClick={switchTheme}>Dark</NavDropdown.Item>
                    <NavDropdown.Item className="bi bi-circle-half" active={lightOrDark !== 'light' && lightOrDark !== 'dark'} data-theme-set="auto" onClick={switchTheme}>Auto</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
        </Navbar>
    );
}

NavBar.propTypes = {
    handleLogout: PropTypes.func.isRequired
};

export default NavBar;
