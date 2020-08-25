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

import {APIProvider} from '../data/apiContext';
import {UserProvider, UserConsumer} from '../data/userContext';

class AdminRouter extends React.Component {
    constructor(props) {
        super(props);
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

                            return (
                                <Login />
                            );
                        }
                    }
                </UserConsumer>
            );
        }

        return (
            <APIProvider>
                <UserProvider>
                    <RenderOrLogin>
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
        );
    }
}

export default AdminRouter;
