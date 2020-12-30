import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'


class IndeterminateCheckbox extends Component {
    static propTypes = {
        checked: PropTypes.bool,
        type: PropTypes.oneOf(['checkbox', 'radio']),
        indeterminate: PropTypes.bool
    };

    static defaultProps = {
        checked: false,
        type: 'checkbox'
    };

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if (this.props.indeterminate === true) {
            this._setIndeterminate(true);
        }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.indeterminate !== this.props.indeterminate) {
            this._setIndeterminate(this.props.indeterminate);
        }
    }

    _setIndeterminate(indeterminate) {
        const node = findDOMNode(this);
        node.indeterminate = indeterminate;
    }

    render() {
        const { indeterminate, type, ...props } = this.props;
        return (
            <input
                type={type}
                {...props}
            />
        )
    }
}

export default IndeterminateCheckbox
