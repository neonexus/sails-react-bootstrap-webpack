import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route, matchPath} from 'react-router-dom';

import logo from '../../images/sails-logo.png';

// eslint-disable-next-line react/no-unsafe
class SidebarNav extends React.Component {
    constructor(props) {
        super(props);

        this.RenderLink = this.RenderLink.bind(this);
    }

    RenderLink(props) {
        const isActive = matchPath(props.location.pathname, props.to);

        return (
            <li className={(isActive ? 'active' : '')}>
                <Link to={props.to} className={isActive ? 'active-sidebar-item' : ''}>
                    {props.children}
                </Link>
            </li>
        );
    }

    render() {
        return (
            <>
                <div id="sidebar-nav" className="hidden-sm">
                    <div className="logo">
                        <Link to="/admin/dashboard">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </div>
                    <div className="sidebar-wrapper">
                        <Route
                            render={({location}) => (
                                <ul className="nav">
                                    <this.RenderLink to="/admin/dashboard" location={location}>
                                        <i className="ni ni-chart-bar-32" /> Dashboard
                                    </this.RenderLink>
                                    <this.RenderLink to="/admin/upgrade" location={location}>
                                        <i className="ni ni-spaceship" /> Upgrade to PRO
                                    </this.RenderLink>
                                </ul>
                            )}
                        />
                    </div>
                </div>
                <div id="main-content">
                    <main className="col">
                        {this.props.children}
                    </main>
                </div>
            </>
        );
    }
}

SidebarNav.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired
};

export default SidebarNav;
