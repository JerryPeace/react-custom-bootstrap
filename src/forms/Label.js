import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styleMaps from '../styleMaps';

class Label extends React.Component {
    static propTypes = {
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        labelAlign: PropTypes.oneOf(['left', 'right'])
    };

    static defaultProps = {
        inline: false,
        labelAlign: 'right'
    };

    renderLabelBase(children) {
        const {className, ...props} = this.props;

        return (
            <label className={classNames(className)}>{children}</label>
        );
    }

    render() {
        const props = this.props;
        let text = props.text,
            labelAlign = props.labelAlign;

        if (labelAlign === 'left') {
            return this.renderLabelBase([
                text,
                props.children
            ]);
        } else {
            return this.renderLabelBase([
                props.children,
                text
            ]);
        }
    }
}

export default Label;
