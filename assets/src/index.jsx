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

function IndexApp() {
    // This file is here mainly for Webpack's dev server; not used in remote settings.
    // Webpack is configured to build the individual apps in their own folders in `.tmp/public` via `npm run build`.
    // Sails will handle the webapp redirects in remote configurations.
    return (
        <Router>
            <Switch>
                <Route path="/admin">
                    <AdminRouter />
                </Route>
                <Route path="/main">
                    <MainRouter />
                </Route>
                <Route>
                    <Redirect to={{pathname: '/main/'}} />
                </Route>
            </Switch>
        </Router>
    );
}

ReactDOM.render(<IndexApp />, document.getElementById('root'));
