import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import Mask from '../mask/Mask';

class Panel extends Component {

    static propTypes = {
        bsClass: PropTypes.string,
        bsStyle: PropTypes.string,
        header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        body: PropTypes.node,
        footer: PropTypes.node,
        mask: PropTypes.bool
    };

    static defaultProps = {
        bsClass: 'panel',
        bsStyle: 'default',
        mask: false
    };

    renderHeader() {
        let header = this.props.header;

        if (!header) {
            return null;
        }

        if (typeof header === 'string') {
            header = <h6 className={'panel-title'}>{header}</h6>;
        }
        return (
            <div className={'panel-heading'}>
                {header}
            </div>
        );
    }

    renderBody() {
        const {mask, body, children} = this.props;
        return (
            <div className={classNames('panel-body', {'maskContainer': mask})}>
                {body}
                {children}
                {mask ? <Mask /> : null}
            </div>
        );
    }

    renderFooter() {
        const footer = this.props.footer;

        return !footer ? null : (
            <div className={'panel-footer'}>{footer}</div>
        );
    }

    render() {
        const {
            body,
            bsClass,
            bsStyle,
            children,
            className,
            footer,
            header,
            mask,
            ...rest
        } = this.props;

        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div {...rest} className={classNames(className, bsCls)} >
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </div>
        );
    }
}

export default Panel;
