/* eslint-disable react/no-unused-state */

import { createContext, Component } from 'react';
import {isObject} from 'lodash';
import PropTypes from 'prop-types';

const UserContext = createContext();

export class UserProvider extends Component {
    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRememberMe = this.handleRememberMe.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            info: props.user || {},
            isLoggedIn: !!(props.user), // if the user prop was given, assume we are logged in
            isRememberMeOn: localStorage.getItem('user_remember_me') === 'true',
            login: this.handleLogin,
            setRememberMe: this.handleRememberMe,
            logout: this.handleLogout
        };
    }

    handleLogin(user) {
        if (user && isObject(user)) {
            this.setState({
                isLoggedIn: true,
                info: user
            });
        }
    }

    handleRememberMe(onOrOff) {
        localStorage.setItem('user_remember_me', onOrOff ? 'true' : 'false');
        this.setState({isRememberMeOn: !!onOrOff});
    }

    handleLogout() {
        this.setState({info: {}, isLoggedIn: false});
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {/* eslint-disable-next-line react/prop-types */}
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

UserProvider.propTypes = {
    user: PropTypes.object
};

UserProvider.defaultProps = {
    user: null
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;
