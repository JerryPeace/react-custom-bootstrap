import React, { Component } from 'react';

const aggridEvents = (WrappedComponent, nativeGrid) => {
    return class AgGridEvents extends Component {

        addEventListener(type, fn) {
            nativeGrid.addEventListener(type, fn);
        }

        removeEventListener(type, fn) {
            nativeGrid.removeEventListener(type, fn);
        }

        render() {
            return <WrappedComponent {...this.props} pipe={this} />
        }
    };
};

export default aggridEvents;

