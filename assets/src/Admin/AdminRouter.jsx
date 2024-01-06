import {Component, StrictMode, Suspense, lazy} from 'react';
import PropTypes from 'prop-types';
import '../../styles/admin/admin.scss';
import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

const Login = lazy(() => import('./Login'));
const Dashboard = lazy(() => import('./Dashboard'));
const Users = lazy(() => import('./Users/Users'));
const Settings = lazy(() => import('./Settings/Settings'));
const PageNotFound = lazy(() => import('./PageNotFound'));

import {UserProvider, UserConsumer} from '../data/UserContext';
import api from '../data/api';

import NavBar from './NavBar';
import {Container} from 'react-bootstrap';

function RenderOrLogin(props) {
    if (props.userContext.isLoggedIn) {
        /* eslint-disable-next-line react/prop-types */
        return props.children;
    }

    if (props.api) {
        return (
            <>
                <NavBar handleLogout={() => alert('logout')} />
                <Login api={props.api} />
            </>
        );
    }

    return null; // not ready yet
}

RenderOrLogin.propTypes = {
    api: PropTypes.object.isRequired,
    userContext: PropTypes.object.isRequired
};

const theApi = new api();

class AdminRouter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            hasRun: false
        };

        theApi.get('/me', (res) => {
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
            <StrictMode>
                <UserProvider user={this.state.user}>
                    <UserConsumer>
                        {
                            (userContext) => (
                                <RenderOrLogin api={theApi} userContext={userContext}>
                                    <>
                                        <NavBar handleLogout={
                                            () => {
                                                theApi.get('/logout', () => {
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
                                                    <Route path="/admin/users" element={<Users api={theApi} />} />
                                                    <Route path="/admin/settings" exact element={<Navigate to="/admin/settings/profile" replace />} />
                                                    <Route path="/admin/settings/*" element={<Settings api={theApi} />} />
                                                    <Route path="/admin/*" element={<PageNotFound />} />
                                                </Routes>
                                            </Container>
                                        </Suspense>
                                    </>
                                </RenderOrLogin>
                            )
                        }
                    </UserConsumer>
                </UserProvider>
            </StrictMode>
        );
    }
}

export default AdminRouter;
