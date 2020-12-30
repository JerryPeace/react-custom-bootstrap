import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {

    static propTypes = {
        node: PropTypes.object,
        windowScope: PropTypes.object
    };

    static defaultProps = {
        windowScope: window.top
    };

    componentDidMount() {
        this.renderPortal();
    }

    componentDidUpdate() {
        this.renderPortal();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.props.node || this.defaultNode);
        this.defaultNode = null;
        this.portal = null;
    }

    renderPortal() {
        const { className, children, node, windowScope } = this.props;
        if (!node && !this.defaultNode) {
            this.defaultNode = windowScope.document.createElement('div');
            if (className) {
                this.defaultNode.className = className;
            }
            windowScope.document.body.appendChild(this.defaultNode);
        }

        this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
            this,
            (typeof children.type === 'function') ? React.cloneElement(children) : children,
            node || this.defaultNode
        );
    }

    render() {
        return null;
    }
}

export default Portal;
