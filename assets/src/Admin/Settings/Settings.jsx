import {useState, lazy, useEffect, Suspense} from 'react';
import PropTypes from 'prop-types';

import {Nav, Spinner, TabContainer, TabContent, TabPane} from 'react-bootstrap';
import {NavLink, Route, Routes, useLocation} from 'react-router-dom';

const ProfileSection = lazy(() => import('./ProfileSection'));
const SecuritySection = lazy(() => import('./SecuritySection'));

function Settings(props) {
    const {pathname} = useLocation();

    const [currentPath, setCurrentPath] = useState(pathname);

    useEffect(() => {
        if (pathname !== currentPath) {
            // Added delay for smoother transitions.
            setTimeout(() => setCurrentPath(pathname), 150);
        }
    }, [pathname]);

    const tabs = [
        {
            name: 'Profile',
            key: 'profile',
            url: '/admin/settings/profile',
            el: <ProfileSection />
        }, {
            name: 'Security',
            key: 'security',
            url: '/admin/settings/security',
            el: <SecuritySection api={props.api} />
        }
    ];

    return (
        <>
            <h1>Settings</h1>

            <TabContainer>
                <Nav variant="tabs" className="mb-4 mt-4" fill>
                    {
                        tabs.map((tab) => (
                            <Nav.Item key={'tab-' + tab.key}>
                                <Nav.Link as={NavLink} to={tab.url} eventKey={tab.key} active={pathname === tab.url} disabled={pathname === tab.url}>
                                    {tab.name}
                                </Nav.Link>
                            </Nav.Item>
                        ))
                    }
                </Nav>
                <TabContent>
                    <Suspense fallback={<div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>}>
                        <Routes>
                            {
                                tabs.map((tab) => (
                                    <Route key={'content-' + tab.key} path={'/' + tab.key} element={
                                        <TabPane eventKey={tab.key} active={pathname === currentPath}>
                                            {tab.el}
                                        </TabPane>
                                    } />
                                ))
                            }
                        </Routes>
                    </Suspense>
                </TabContent>
            </TabContainer>
        </>
    );
}

Settings.propTypes = {
    api: PropTypes.object.isRequired
};

export default Settings;
