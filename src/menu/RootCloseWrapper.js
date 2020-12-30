// ref by https://github.com/react-bootstrap/react-overlays/blob/master/src/RootCloseWrapper.js
import PropTypes from 'prop-types';

import React from 'react';
import {domHelper} from '../utils'

class RootCloseWrapper extends React.Component {
    static propTypes = {
        onRootClose: PropTypes.func,
        children: PropTypes.element,
        disabled: PropTypes.bool, // Disable the the RootCloseWrapper, preventing it from triggering 'onRootClose'.
        event: PropTypes.oneOf(['click', 'mousedown']) // Choose which document mouse event to bind to
    };

    static defaultProps = {
        event: 'click'
    };

    constructor(props, context) {
        super(props, context);

        this.preventRootClose = false;
    }

    componentDidMount() {
        if (!this.props.disabled) {
            this.addEventListeners();
        }
    }

    componentDidUpdate(prevProps) {
        if (!this.props.disabled && prevProps.disabled) {
            this.addEventListeners();
        } else if (this.props.disabled && !prevProps.disabled) {
            this.removeEventListeners();
        }
    }

    componentWillUnmount() {
        if (!this.props.disabled) {
            this.removeEventListeners();
        }
    }

    addEventListeners() {
        const {event} = this.props;

        /*
            Use capture for this listener so it fires before React's listener, to
            avoid false positives in the contains() check below if the target DOM
            element is removed in the React mouse callback.
        */
        this.mouseCaptureListener = domHelper.events.addEventListener(document, event, this.handleMouseCapture, true)
        this.mouseListener = domHelper.events.addEventListener(document, event, this.handleMouse)
    }

    removeEventListeners() {
        this.mouseCaptureListener.remove();
        this.mouseListener.remove();
    }

    handleMouseCapture = (event) => {
        this.preventRootClose = domHelper.query.contains(this.node, event.target);
    };

    handleMouse = () => {
        if (!this.preventRootClose && this.props.onRootClose) {
            this.props.onRootClose();
        }
    };

    getNode() {
        return this.node;
    }

    render() {
        return React.cloneElement(this.props.children, {
            ref: node => this.node = node
        })
    }
}

export default RootCloseWrapper;
