import React from 'react';
import ReactDOM from 'react-dom';

import MainRouter from './Main/MainRouter';

function MainApp() {
    return (
        <MainRouter />
    );
}

ReactDOM.render(<MainApp />, document.getElementById('root'));
