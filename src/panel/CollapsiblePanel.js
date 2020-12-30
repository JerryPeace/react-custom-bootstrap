import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Collapse from '../collapse/Collapse';
import styleMaps from '../styleMaps';

class CollapsiblePanel extends Collapse {

    static propTypes = {
        titleText: PropTypes.node
    };

    constructor(props) {
        super(props);
        this.handleClick = ::this.handleClick;
    }

    renderTitle() {
        const { titleText } = this.props;
        const titleStyle = {
            fontSize: '16px',
            color: '#222'
        };
        return (
            <span
                className={`${styleMaps.CLASSES.collapse}-header-text`}
                style={titleStyle}>
                {titleText}
            </span>
        );
    }

    renderArrowIcon() {
        const arrowStyle = {
            float: 'right',
            fontSize: '20px',
            color: '#666'
        };
        const cls = classNames(`${styleMaps.CLASSES.collapse}-header-arrow-icon`, 'fa', {
            'fa-angle-down': this.state.in,
            'fa-angle-up': !this.state.in
        });

        return (<span className={cls} style={arrowStyle}></span>);
    }

    renderHeader() {
        const collapserCls = `${styleMaps.CLASSES.tm}-${styleMaps.CLASSES.collapser}`;
        const cls = classNames(`${styleMaps.CLASSES.collapse}-header`, {
            closed: !this.state.in
        }, collapserCls);
        const headerStyle = {
            padding: '8px 12px',
            backgroundColor: '#eee',
            height: '40px'
        };

        return (
            <div
                onClick={this.handleClick}
                className={cls}
                style={headerStyle}>
                {this.renderArrowIcon()}
                {this.renderTitle()}
            </div>
        );
    };

    renderPanelBody() {
        const { children } = this.props;
        const clsName = styleMaps.CLASSES.collapse;
        const cls = classNames({
            in: this.state.in
        }, clsName);
        const bodyStyle = { padding: '8px 0px' };

        return (
            <div className={cls}>
                <div style={bodyStyle}>
                    {children}
                </div>
            </div>
        );
    }
}

export default CollapsiblePanel;
