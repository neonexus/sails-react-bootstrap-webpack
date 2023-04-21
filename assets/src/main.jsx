import {createRoot} from 'react-dom/client';

import Main from './Main/Main';

function MainApp() {
    return (
        <Main />
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<MainApp />);
