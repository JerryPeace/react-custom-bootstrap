import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import Glyphicon from '../glyphicon/Glyphicon';
import styleMaps from '../styleMaps';

class Collapse extends React.Component {
    static propTypes = {
        titleText: PropTypes.node,
        expand: PropTypes.bool,
        defaultExpand: PropTypes.bool,
        arrowEl: PropTypes.element,
        onCollapse: PropTypes.func,
        onExpand: PropTypes.func,
        onToggle: PropTypes.func,
        collapsible: PropTypes.bool
    };

    static defaultProps = {
        defaultExpand: true,
        collapsible: true
    };

    constructor(props) {
        super(props);
        this.state = {
            in: this.props.defaultExpand
        };
    }

    toggle() {
        this.setState({in: !this.state.in}, ()=>{
            const { onExpand, onCollapse, onToggle } = this.props;
            const expand = this.state.in;
            if (expand) {
                onExpand && onExpand();
            } else {
                onCollapse && onCollapse();
            }

            onToggle && onToggle(expand);
            return true;
        });
    }

    handleClick() {
        if (this.props.collapsible) {
            this.toggle();
        }
    }

    renderPanel() {
        return (
            <div>
                {this.renderHeader()}
                {this.renderPanelBody()}
            </div>
        );
    }

    renderArrowIcon() {
        const { arrowEl } = this.props;

        if (arrowEl) {
            return arrowEl;
        } else {
            const arrowCls = styleMaps.CLASSES.arrow;
            const arrowIconCls = styleMaps.CLASSES['arrow-icon'];

            return <span className={classNames(arrowCls, arrowIconCls)}></span>
        }
    }

    renderTitle() {
        const { titleText } = this.props;
        const collapserTitleCls = styleMaps.CLASSES.tm + '-' + styleMaps.CLASSES['collapser-title'];
        return (
            <span className={collapserTitleCls}>
                {titleText}
            </span>
        );
    }

    renderHeader() {
        const { expand } = this.props;
        const collapserCls = styleMaps.CLASSES.tm + '-' + styleMaps.CLASSES.collapser;
        const cls = {
            closed: typeof expand === 'boolean' ? !expand : !this.state.in
        };
        return (
            <div
                onClick={::this.handleClick}
                className={classNames(cls, collapserCls)}>
                {this.renderArrowIcon()}
                {this.renderTitle()}
            </div>
        );
    };

    renderPanelBody() {
        const { children, expand } = this.props;
        const clsName = styleMaps.CLASSES.collapse;

        const cls = {
            in: typeof expand === 'boolean' ? expand : this.state.in
        };
        return (
            <div className={classNames(cls, clsName)}>
                <div className={styleMaps.CLASSES['panel-body']}>
                    {children}
                </div>
            </div>
        );
    }

    render() {
        let { className } = this.props;
        let bsCls = bootstrapUtils.getCls(this.props);
        const clsName = styleMaps.CLASSES['panel-collapse'];

        return  (
            <div className={classNames(className, bsCls, clsName)}>
                {this.renderPanel()}
            </div>
        );
    }
}

export default Collapse;
