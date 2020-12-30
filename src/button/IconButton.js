import PropTypes from 'prop-types';
import React from 'react';
import bootstrapUtils from '../utils/bootstrapUtils';
import classNames from 'classnames';
import styleMaps from '../styleMaps';
import Glyphicon from '../glyphicon/Glyphicon';

class IconButton extends React.Component {

    static propTypes = {
        bsSize: PropTypes.oneOf(['lg', 'sm', 'xs']),
        type: PropTypes.oneOf(['button', 'submit', 'reset']),
        block: PropTypes.bool,
        active: PropTypes.bool,
        onClick: PropTypes.func,
        glyphiconType: PropTypes.string,
        imgIconSrc: PropTypes.string,
        buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        isDropdown: PropTypes.bool,
        isCaretStyle: PropTypes.bool,
        isIconOnly: PropTypes.bool,
        bsClass: PropTypes.string,
        bsStyle: PropTypes.string,
        standalone: PropTypes.bool
    };

    static defaultProps = {
        bsClass: 'button',
        bsStyle: 'default',
        type: 'button',
        block: false,
        active: false,
        isDropdown: false,
        isCaretStyle: false
    };

    componentDidMount() {
        console.warn('<IconButton> will be deprecated. please use <Button> instead');
    }

    renderIcon() {
        if (this.props.imgIconSrc) {
            return (<img src={this.props.imgIconSrc}/>);
        } else if (this.props.glyphiconType) {
            return (<Glyphicon bsStyle={this.props.glyphiconType} />);
        } else {
            return null;
        }
    }

    render() {
        const {
            children,
            className,
            block,
            active,
            isDropdown,
            isCaretStyle,
            bsClass,
            bsStyle,
            bsSize,
            glyphiconType,
            buttonText,
            standalone,
            isIconOnly,
            ...rest
        } = this.props;

        const {
            caret,
            'dropdown-toggle': dropdownToggle,
        } = styleMaps.CLASSES;

        const classes = {
            'btn-block': block,
            'active': active,
            'btn-icon-only': isIconOnly,
            [dropdownToggle]: isDropdown
        };
        const icon = this.renderIcon();
        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <button
                {...rest}
                className={classNames(className, classes, bsCls)}
            >
                {icon}
                {icon && ' '}
                {buttonText}
                {children}
                {isCaretStyle && ' '}
                {isCaretStyle && <span className={caret} />}
            </button>
        );
    }

}

export default IconButton;
