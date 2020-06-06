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
