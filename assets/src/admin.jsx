import {createRoot} from 'react-dom/client';
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

const root = createRoot(document.getElementById('root'));
root.render(<AdminApp />);
