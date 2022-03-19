import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Main from './Main/Main';
import AdminRouter from './Admin/AdminRouter';

function IndexApp() {
    // This file is here mainly for Webpack's dev server; not used in remote settings.
    // Webpack is configured to build the individual apps in their own folders in `.tmp/public` via `npm run build`.
    // Sails will handle the webapp redirects in remote configurations.
    return (
        <Router>
            <Routes>
                <Route path="/admin/*" element={<AdminRouter />} />
                <Route index path="/main/*" element={<Main />} />
                <Route path="/" element={<Navigate to="/main" />} />
            </Routes>
        </Router>
    );
}

ReactDOM.render(<IndexApp />, document.getElementById('root'));
