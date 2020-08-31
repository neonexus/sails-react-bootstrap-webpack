import React from 'react';
import Dashboard from './Dashboard';
import '../../styles/admin/admin.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';

import Login from '../Admin/Login';
import Upgrade from './Upgrade';
import PropTypes from 'prop-types';

import {UserProvider, UserConsumer} from '../data/userContext';
import api from '../data/api';

import NavBar from './NavBar';
import {Container} from 'react-bootstrap';

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
        function RenderOrLogin(props) {
            return (
                <UserConsumer>
                    {
                        (userContext) => {
                            if (userContext.isLoggedIn) {
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

        if (!this.state.hasRun) {
            return null;
        }

        return (
            <Router>
                <UserProvider user={this.state.user}>
                    <RenderOrLogin api={this.state.api}>
                        <NavBar api={this.state.api} />
                        <Container>
                            <Switch>
                                <Route path="/admin/dashboard">
                                    <Dashboard />
                                </Route>
                                <Route path="/admin/upgrade">
                                    <Upgrade />
                                </Route>
                                <Route>
                                    <Redirect to="/admin/dashboard" />
                                </Route>
                            </Switch>
                        </Container>
                    </RenderOrLogin>
                </UserProvider>
            </Router>
        );
    }
}

export default AdminRouter;
