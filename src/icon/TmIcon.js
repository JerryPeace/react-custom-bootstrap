import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

// should be the same as prefix-classname of tm icon & tm color
const TM_ICON_CSS_PREFIX = 'tmicon';
const TM_COLOR_CSS_PREFIX = 'tmcolor';

class TmIcon extends Component {
    static propTypes = {
        color: PropTypes.string,
        name: PropTypes.string,
        prefix: PropTypes.string,
        size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        tag: PropTypes.string,
        style: PropTypes.object
    };

    static defaultProps = {
        prefix: TM_ICON_CSS_PREFIX,
        tag: 'span'
    };

    getClassName() {
        const {
            className,
            color,
            name,
            prefix
        } = this.props;

        return classNames(prefix, `${prefix}-${name}`, className, {
            [`${TM_COLOR_CSS_PREFIX}-${color}`]: !!color
        });
    }

    getStyles() {
        const { size, style } = this.props;
        const styles = { ...style };
        if (size) {
            styles.fontSize = size;
        }

        return styles;
    }

    render() {
        const {
            className,
            color,
            name,
            prefix,
            size,
            style,
            tag: ElementTag,
            ...restProps
        } = this.props;

        return (
            <ElementTag
                className={this.getClassName()}
                style={this.getStyles()}
                {...restProps}
                />
        );
    }
}

export default TmIcon;
