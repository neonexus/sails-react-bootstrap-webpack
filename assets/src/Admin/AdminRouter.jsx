import React, {Suspense, lazy} from 'react';
import '../../styles/admin/admin.scss';
import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from '../Admin/Login';

const Dashboard = lazy(() => import('./Dashboard'));
const Users = lazy(() => import('./Users'));
import PropTypes from 'prop-types';

import {UserProvider, UserConsumer} from '../data/userContext';
import api from '../data/api';

import NavBar from './NavBar';
import {Button, Container} from 'react-bootstrap';

function RenderOrLogin(props) {
    if (props.userContext.isLoggedIn) {
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

RenderOrLogin.propTypes = {
    api: PropTypes.object.isRequired,
    userContext: PropTypes.object.isRequired
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
            <React.StrictMode>
                <UserProvider user={this.state.user}>
                    <UserConsumer>
                        {
                            (userContext) => (
                                <RenderOrLogin api={this.state.api} userContext={userContext}>
                                    <>
                                        <NavBar handleLogout={
                                            () => {
                                                this.state.api.get('/logout', () => {
                                                    userContext.logout();
                                                });
                                            }
                                        }
                                        />

                                        <Suspense fallback={<Container><h2 className="mt-3">LOADING...</h2></Container>}>
                                            <Container fluid="md">
                                                <Routes>
                                                    <Route path="/admin" exact element={<Navigate to="/admin/dashboard" replace />} />
                                                    <Route path="/admin/dashboard" element={<Dashboard />} />
                                                    <Route path="/admin/users" element={<Users api={this.state.api} />} />
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
                                        </Suspense>
                                    </>
                                </RenderOrLogin>
                            )
                        }
                    </UserConsumer>
                </UserProvider>
            </React.StrictMode>
        );
    }
}

export default AdminRouter;
