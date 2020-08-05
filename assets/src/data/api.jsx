import React from 'react';
import api from '../common/api';

const apiContext = React.createContext();

export class APIProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            api: new api()
        };
    }

    render() {
        return (
            <apiContext.Provider value={this.state.api}>
                {/* eslint-disable-next-line react/prop-types */}
                {this.props.children}
            </apiContext.Provider>
        );
    }
}

export const APIConsumer = apiContext.Consumer;
