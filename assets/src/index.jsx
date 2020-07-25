import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import AdminRouter from './Admin/AdminRouter';
import MainRouter from './Main/MainRouter';

import {
    RecoilRoot
} from 'recoil';

function IndexApp() {
    const adminInit = {
        isAuthenticated: false,
        user: null
    };

    const mainInit = {};

    return (
        <Router>
            <Switch>
                <Route path="/admin">
                    <RecoilRoot initializeState={adminInit}>
                        <AdminRouter />
                    </RecoilRoot>
                </Route>
                <Route path="/main">
                    <RecoilRoot initializeState={mainInit}>
                        <MainRouter />
                    </RecoilRoot>
                </Route>
                <Route>
                    <Redirect to={{pathname: '/main/'}} />
                </Route>
            </Switch>
        </Router>
    );
}

ReactDOM.render(<IndexApp />, document.getElementById('root'));
