import React from 'react';
import Main from './Main';
import '../../styles/marketing/marketing.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';

function MainRouter() {
    return (
        <Router>
            <Switch>
                <Route path="/main">
                    <Main />
                </Route>
                <Route>
                    <Redirect to={{pathname: '/main'}} />
                </Route>
            </Switch>
        </Router>
    );
}

export default MainRouter;
