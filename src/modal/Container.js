import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import CustomPropTypes from '../utils/CustomPropTypes';
import styleMaps from '../styleMaps';

// This is the default Escape key defined in W3C, see
// https://www.w3.org/TR/uievents-key/#key-Escape
const DEFAULT_ESCAPE_KEY = 'Escape'

class ModalContainer extends Component {
    static propTypes = {
        bsClass: PropTypes.string,
        bsSize: CustomPropTypes.keyOf(styleMaps.SIZES),
        dialogClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        noCover: PropTypes.bool,
        show: PropTypes.bool,
        isLoading: PropTypes.bool,
        onEscapePressed: PropTypes.func
    };

    static defaultProps = {
        bsClass: 'modal',
        bsSize: styleMaps.SIZES.md,
        noCover: false
    };

    constructor(props) {
        super(props);
        this.handleKeyUp = ::this.handleKeyUp;
    }

    handleKeyUp(e) {
        const { onEscapePressed } = this.props;
        e.key === DEFAULT_ESCAPE_KEY && onEscapePressed && onEscapePressed();
    }

    render() {
        const {
            bsClass,
            children,
            className,
            dialogClassName,
            noCover,
            show,
            onEscapePressed,
            isLoading
        } = this.props;
        // We have to take bsSize out of props to prevent modal size been put at cover layer.
        const { bsSize, ...otherProps } = this.props;
        const bsCls = noCover ? 'no-cover' : bootstrapUtils.getCls(otherProps);
        const sizeCls = `${bsClass}-${bsSize}`;
        const dialogCls = classNames(
            styleMaps.CLASSES['modal-dialog'],
            sizeCls,
            dialogClassName,
            {
                'tm-loading': isLoading
            }
        );

        return (
            <div
                className={classNames(className, bsCls, { show })}
                onKeyUp={onEscapePressed ? this.handleKeyUp : null}>
                <div className={dialogCls}>
                    <div className={styleMaps.CLASSES['modal-content']}>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalContainer;
