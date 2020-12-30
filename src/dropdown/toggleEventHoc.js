import PropTypes from 'prop-types';
import React, { Component } from 'react';

const toggleEventHoc = (WrappedComponent) => (class extends Component {
    static propTypes = {
        wrappedComponentRef: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.handleMenuToggled = ::this.handleMenuToggled;
        this.handleRootClosed = ::this.handleRootClosed;
    }

    handleMenuToggled() {
        this.setState({
            open: !this.state.open
        });
    }

    handleRootClosed() {
        this.setState({
            open: false
        });
    }

    render() {
        const {
            wrappedComponentRef,
            ...restProps
        } = this.props;
        return (
            <WrappedComponent
                ref={wrappedComponentRef}
                isMenuOpen={this.state.open}
                onMenuToggled={this.handleMenuToggled}
                onRootClosed={this.handleRootClosed}
                {...restProps} />
        );
    }
});

export default toggleEventHoc;
