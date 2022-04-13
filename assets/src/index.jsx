import React, {Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {
    BrowserRouter,
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
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/admin/*" element={<AdminRouter />} />
                    <Route index path="/main/*" element={<Main />} />
                    <Route path="/" element={<Navigate to="/main" />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<IndexApp />);
