import React from 'react';
import Dashboard from './Dashboard';
import '../../styles/admin/admin.scss';
import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from '../Admin/Login';
import Upgrade from './Upgrade';
import PropTypes from 'prop-types';

import {UserProvider, UserConsumer} from '../data/userContext';
import api from '../data/api';

import NavBar from './NavBar';
import {Button, Container} from 'react-bootstrap';

function RenderOrLogin(props) {
    return (
        <UserConsumer>
            {
                (userContext) => {
                    if (userContext.isLoggedIn) {
                        /* eslint-disable-next-line react/prop-types */
                        return props.children;
                    }

                    if (props.api) {
                        return (
                            <Login api={props.api} />
                        );
                    }

                    return null; // not ready yet
                }
            }
        </UserConsumer>
    );
}

RenderOrLogin.propTypes = {
    api: PropTypes.object.isRequired
};

class AdminRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            api: new api(),
            user: null,
            hasRun: false
        };

        this.state.api.get('/me', (res) => {
            if (res.success) {
                return this.setState({user: res.user, hasRun: true});
            }

            console.error('Something went wrong', res);
        }, () => {
            // we are likely not logged in
            this.setState({hasRun: true});
        });
    }

    render() {
        if (!this.state.hasRun) {
            return null;
        }

        return (
            <UserProvider user={this.state.user}>
                <NavBar api={this.state.api} />
                <RenderOrLogin api={this.state.api}>
                    <Container>
                        <Routes>
                            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                            <Route path="/admin/upgrade" element={<Upgrade />} />
                            <Route
                                path="/admin/*"
                                element={
                                    <>
                                        <h1>Page Not Found</h1>
                                        <div>
                                            The page you have requested does not exist. Maybe go back and try again?
                                            <br />
                                            <br />
                                            <Button variant="outline-secondary" onClick={() => window.history.back()}>&#8678; Go Back</Button>
                                        </div>
                                    </>
                                }
                            />
                        </Routes>
                    </Container>
                </RenderOrLogin>
            </UserProvider>
        );
    }
}

export default AdminRouter;
