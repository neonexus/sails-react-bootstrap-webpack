import React from 'react';
import Dashboard from './Dashboard';
import '../../styles/admin/admin.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import api from '../common/api';

import Login from '../Admin/Login';
import SidebarNav from './SidebarNav';
import Upgrade from './Upgrade';

class AdminRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            api: new api(),
            isAuthenticated: false,
            user: sessionStorage.getItem('user')
        };

        this.userLogin = this.userLogin.bind(this);
        this.userLogout = this.userLogout.bind(this);
    }

    userLogin(user) {
        this.setState({user, isAuthenticated: true});
        sessionStorage.setItem('user', user);
    }

    userLogout() {
        this.setState({user: {}, isAuthenticated: false});
        sessionStorage.removeItem('user');
    }

    render() {
        const that = this;

        function RenderOrLogin(props) {
            if (that.state.isAuthenticated) {
                return props.children;
            }

            // return (
            //     <Redirect
            //         to={{
            //             pathname: '/admin/login',
            //             state: {from: props.location}
            //         }}
            //     />
            // );
            return (<Login location={props.location} api={that.state.api} userLogin={that.userLogin} />);
        }

        return (
            <Router>
                <Route
                    render={({location}) => (
                        <RenderOrLogin location={location}>
                            <SidebarNav>
                                <Switch>
                                    <Route path="/admin/dashboard">
                                        <Dashboard api={this.state.api} user={this.state.user} />
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
                    )}
                />
            </Router>
        );
    }
}

export default AdminRouter;
