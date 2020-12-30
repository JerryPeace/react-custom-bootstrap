import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import styleMaps from '../styleMaps';

class Header extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        closeBtn: PropTypes.bool

    };

    static defaultProps = {
        bsClass: 'modal-header'
    };

    renderCloseBtn() {
        const {closeBtn, onClick} = this.props;

        if (!closeBtn) {
            return null;
        } else {
            return (
                <button
                    type='button'
                    className='close'
                    aria-label='Close'
                    onClick={onClick}
                    >
                    <span aria-hidden={true}>&times;</span>
                </button>
            );
        }
    }

    renderTitle() {
        const {children} = this.props;

        return <h4 className={styleMaps.CLASSES['modal-title']}>{children}</h4>;
    }

    render() {
        const {children, className, closeBtn} = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div className={classNames(className, bsCls)}>
                {this.renderCloseBtn()}
                {this.renderTitle()}
            </div>
        );
    }
}

export default Header;
