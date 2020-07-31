import React from 'react';

const userContext = React.createContext();

export class UserProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            isLoggedIn: false,
            isRememberMeOn: JSON.parse(localStorage.getItem('user_remember_me')) || false
        };

        if (this.state.isRememberMeOn) {
            this.state.user.email = localStorage.getItem('user_email') || '';
        } else {
            this.state.user.email = '';
        }
    }

    render() {
        return (
            <userContext.Provider
                value={{
                    user: this.state.user,
                    isLoggedIn: this.state.isLoggedIn,
                    isRememberMeOn: this.state.isRememberMeOn
                }}
            >
                {/* eslint-disable-next-line react/prop-types */}
                {this.props.children}
            </userContext.Provider>
        );
    }
}

export const UserConsumer = userContext.Consumer;
