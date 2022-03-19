import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';
import AdminRouter from './Admin/AdminRouter';

function AdminApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<AdminRouter />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.render(<AdminApp />, document.getElementById('root'));
