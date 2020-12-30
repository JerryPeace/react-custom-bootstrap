import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

class CloseIcon extends React.Component {

    static propTypes = {
        onClick: PropTypes.func
    };

    constructor (props) {
        super(props);
        this.onClick = ::this.onClick;
    }

    onClick(e) {
        e.preventDefault();
        !!this.props.onClick && this.props.onClick(e);
    }

    render() {
        return (
            <a
                href='#'
                className={classNames('close', this.props.className)}
                onClick={this.onClick}>
                <span>&times;</span>
            </a>
        );
    }
}

export default CloseIcon;
