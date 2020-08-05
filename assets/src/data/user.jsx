import React from 'react';
import {isObject} from 'lodash';

const userContext = React.createContext();

export class UserProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            isLoggedIn: false,
            isRememberMeOn: localStorage.getItem('user_remember_me') === 'true'
        };

        // if (this.state.isRememberMeOn) {
        //     this.state.user.email = localStorage.getItem('user_email') || '';
        // } else {
        //     this.state.user.email = '';
        // }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRememberMe = this.handleRememberMe.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin(user) {
        if (user && isObject(user)) {
            this.setState({
                isLoggedIn: true,
                user
            });
        }
    }

    handleRememberMe(onOrOff) {
        localStorage.setItem('user_remember_me', onOrOff);
        this.setState({isRememberMeOn: onOrOff});
    }

    handleLogout() {
        this.setState({user: {}, isLoggedIn: false});
    }

    render() {
        return (
            <userContext.Provider
                value={{
                    user: this.state.user,
                    isLoggedIn: this.state.isLoggedIn,
                    isRememberMeOn: this.state.isRememberMeOn,
                    login: this.handleLogin,
                    setRememberMe: this.handleRememberMe,
                    logout: this.handleLogout
                }}
            >
                {/* eslint-disable-next-line react/prop-types */}
                {this.props.children}
            </userContext.Provider>
        );
    }
}

export const UserConsumer = userContext.Consumer;
