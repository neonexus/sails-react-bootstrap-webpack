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
import SidebarNav from './SidebarNav';
import Upgrade from './Upgrade';

import {APIProvider} from '../data/api';
import {UserProvider, UserConsumer} from '../data/user';

class AdminRouter extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     isAuthenticated: false,
        //     user: sessionStorage.getItem('user')
        // };

        // this.userLogin = this.userLogin.bind(this);
        // this.userLogout = this.userLogout.bind(this);
    }

    // userLogin(user) {
    //     this.setState({user, isAuthenticated: true});
    //     sessionStorage.setItem('user', user);
    // }
    //
    // userLogout() {
    //     this.setState({user: {}, isAuthenticated: false});
    //     sessionStorage.removeItem('user');
    // }

    render() {
        const that = this;

        function RenderOrLogin(props) {
            // if (that.state.isAuthenticated) {
            //     return props.children;
            // }

            // return (
            //     <Redirect
            //         to={{
            //             pathname: '/admin/login',
            //             state: {from: props.location}
            //         }}
            //     />
            // );

            return (
                <UserConsumer>
                    {
                        (userContext) => {
                            if (userContext.isLoggedIn) {
                                return props.children;
                            }

                            return (
                                <Login />
                            );
                        }
                    }
                </UserConsumer>
            );
        }

        return (
            <Router>
                <Route
                    render={({location}) => (
                        <APIProvider>
                            <UserProvider>
                                <RenderOrLogin location={location}>
                                    <SidebarNav>
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
                                    </SidebarNav>
                                </RenderOrLogin>
                            </UserProvider>
                        </APIProvider>
                    )}
                />
            </Router>
        );
    }
}

export default AdminRouter;
