import React from 'react';
import ReactDOM from 'react-dom';

import AdminRouter from './Admin/AdminRouter';

function AdminApp() {
    return (
        <AdminRouter />
    );
}

ReactDOM.render(<AdminApp />, document.getElementById('root'));
