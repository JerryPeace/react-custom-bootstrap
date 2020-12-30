import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import shallowCompare from '../utils/shallowCompare'

let visibleDynamicToolTip = null;

const defaultPad = {
    x: 5,
    y: 5
};

function fixPosIfOutOfBound(left, top, target) {
    let fixedTop = top;
    let fixedLeft = left;
    const targetW = target.offsetWidth;
    const targetH = target.offsetHeight;
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    if ((left + targetW) > clientWidth) {
        fixedLeft = clientWidth - targetW - defaultPad.x;
        if (fixedLeft < 0) {
            fixedLeft = 0;
        }
    }
    if ((top + targetH) > clientHeight) {
        fixedTop = clientHeight - targetH - defaultPad.y;
        if (fixedTop < 0) {
            fixedTop = 0;
        }
    }

    return {
        left: fixedLeft,
        top: fixedTop
    }
}

const POPOVER = 'popover';
const TOOLTIP = 'tooltip';
const INFOTIP = 'infotip';
const TOP = 'top';
const TOPLEFT = 'top-left';
const TOPRIGHT = 'top-right';
const RIGHT = 'right';
const RIGHTTOP = 'right-top';
const RIGHTBOTTOM = 'right-bottom';
const LEFT = 'left';
const LEFTTOP = 'left-top';
const LEFTBOTTOM = 'left-bottom';
const BOTTOM = 'bottom';
const BOTTOMLEFT = 'bottom-left';
const BOTTOMRIGHT = 'bottom-right';
const CENTER = 'center';
const placementTypeCheck = [
    TOP,
    TOPLEFT,
    TOPRIGHT,
    RIGHT,
    RIGHTTOP,
    LEFT,
    LEFTTOP,
    LEFTBOTTOM,
    BOTTOM,
    BOTTOMLEFT,
    BOTTOMRIGHT
];
const arrowTypeCheck = [
    LEFT,
    CENTER,
];

class Tooltip extends Component {

    static propTypes = {
        autoRender: PropTypes.bool,
        delayHide: PropTypes.number,
        delayShow: PropTypes.number,
        disableTooltip: PropTypes.bool,
        displayValue: PropTypes.node,
        enableStopPropagation: PropTypes.bool,
        fixedWidth: PropTypes.bool,
        followCursor: PropTypes.bool,
        forceShow: (props, propName, componentName) => {
            if (props[propName] === true && props.mode === INFOTIP) {
                throw new Error('You cannot use forceShow in infotip mode');
            }
        },
        getTargetEl: PropTypes.func,
        ifWrapText: PropTypes.bool,
        mode: PropTypes.oneOf([POPOVER, TOOLTIP, INFOTIP]),
        offsetTooltip: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        placement: PropTypes.oneOf(placementTypeCheck),
        popoverTitle: PropTypes.string,
        arrowDirecton: PropTypes.oneOf(arrowTypeCheck),
        show: PropTypes.bool,
        tooltipClassName: PropTypes.string,
        tooltipMaxWidth: PropTypes.number,
        tooltipStyle: PropTypes.object,
        tooltipValue: PropTypes.node
    };

    static defaultProps = {
        autoRender: true,
        delayHide: 500,
        delayShow: 500,
        disableTooltip: false,
        followCursor: true,
        forceShow: false,
        getTargetEl: () => {
            return void 0;
        },
        ifWrapText: false,
        mode: 'infotip',
        offsetTooltip: {
            x: 0,
            y: 0
        },
        placement: 'top',
        arrowDirecton: 'center',
        popoverTitle: '',
        tooltipMaxWidth: 680,
        tooltipStyle: {},
        tooltipValue: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            lastTipPosEvt: null,
            hideTooltip: props.forceShow ? false : true,
            isCursorMoving: false,
            isCursorOver: false,
            tooltipX: -1000,
            tooltipY: -1000
        };
        this.tooltipContents = null;
        const container = document.querySelector('.tm-tooltip-g-container');

        if (this.isInfoTipMode()) {
            if (container) {
                this.globalTooltipContainer = container;
            } else {
                this.globalTooltipContainer = document.createElement('div');
                this.globalTooltipContainer.className = classNames('tm-tooltip-g-container', props.className);
                document.body.appendChild(this.globalTooltipContainer);
            }

        }

        this.debounceCheckShowingTooltip = _.debounce(() => {
            if (this.state.hideTooltip && !this.state.isCursorMoving && this.state.isCursorOver) {
                this.setState({
                    hideTooltip: false
                });
                this.updateTooltipPosition(this.state.lastTipPosEvt);
            }
        }, this.props.delayShow);
        this.debounceUpdateCursorStill = _.debounce(() => {
            this.setState({isCursorMoving: false});
        }, 200);
        this.handleMouseOverTarget = ::this.handleMouseOverTarget;
        this.handleMouseOutTarget = ::this.handleMouseOutTarget;
        this.handleMouseMoveOnTarget = ::this.handleMouseMoveOnTarget;
        this.handleMouseOutTooltip = ::this.handleMouseOutTooltip;
        this.handleMouseOverTooltip = ::this.handleMouseOverTooltip;
        this.updateTooltipPosition = ::this.updateTooltipPosition;
    }

    componentDidMount() {
        const {
            autoRender,
            followCursor,
            forceShow,
            getTargetEl,
            mode,
            show
        } = this.props;
        if (!autoRender) {
            setTimeout(this.updateTooltipPosition, 33);
            return;
        }
        const target = getTargetEl();
        const isInfoTipMode = this.isInfoTipMode();
        const mouseEvents = this.getMouseEventOpts();
        if (isInfoTipMode && target) {
            if (document.querySelector('.tm-tooltip-g-container .tm-tooltip') === null) {
                this.tooltipContents = this.getDynamicToolTip();
                ReactDOM.render(this.tooltipContents, this.globalTooltipContainer);
            }
            target.addEventListener('mouseover', mouseEvents.onMouseOver);
            target.addEventListener('mouseout', mouseEvents.onMouseOut);
            target.addEventListener('mousemove', mouseEvents.onMouseMove);
        }

        if (!isInfoTipMode && target) {
            window.addEventListener('scroll', this.updateTooltipPosition);
            window.addEventListener('resize', this.updateTooltipPosition);
        }
        if (!forceShow && target) {
            if (mode === INFOTIP || mode === TOOLTIP) {
                target.addEventListener('mouseover', mouseEvents.onMouseOver);
                target.addEventListener('mouseout', mouseEvents.onMouseOut);
                target.addEventListener('mousemove', mouseEvents.onMouseMove);
            } else if (mode === POPOVER) {
                /* eslint-disable react/no-did-mount-set-state */
                target.addEventListener('focus', () => {
                    this.setState({
                        hideTooltip: false
                    }, this.updateTooltipPosition);
                });
                target.addEventListener('blur', () => {
                    this.setState({
                        hideTooltip: true
                    }, this.updateTooltipPosition);
                });
                /* eslint-enable react/no-did-mount-set-state */
            }
        }

        if (forceShow) {
            //should wait until dom rendered
            setTimeout(this.updateTooltipPosition, 33);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentDidUpdate() {
        const {forceShow} = this.props;

        if (this.isInfoTipMode()) {
            const isHidden = this.isHiddenTooltip();
            // Update dynamicToolTip if tooltip is visible or tooltip disappear from view
            if (!isHidden || (isHidden && visibleDynamicToolTip === this)) {
                visibleDynamicToolTip = isHidden ? null : this;
                this.tooltipContents = this.getDynamicToolTip();
                ReactDOM.render(this.tooltipContents, this.globalTooltipContainer);
            }
        } else if (forceShow) {
            this.updateTooltipPosition();
        }
    }

    componentWillUnmount() {
        const {autoRender, getTargetEl} = this.props;
        const target = getTargetEl();
        if (autoRender && target) {
            const mouseEvents = this.getMouseEventOpts();
            target.removeEventListener('mouseover', mouseEvents.onMouseOver);
            target.removeEventListener('mouseout', mouseEvents.onMouseOut);
            target.removeEventListener('mousemove', mouseEvents.onMouseMove);
            window.removeEventListener('scroll', this.updateTooltipPosition);
            window.removeEventListener('resize', this.updateTooltipPosition);
        }
        if (this.tooltipContents) {
            ReactDOM.unmountComponentAtNode(this.globalTooltipContainer);
            this.tooltipContents = null;
        }
    }

    isInfoTipMode() {
        return this.props.mode === INFOTIP;
    }

    attempToStopPropagation(e) {
        if (this.props.enableStopPropagation) {
            // this is native event rather than synthetic events
            e.stopPropagation();
        }
    }

    handleMouseOverTarget(evt) {
        const {delayShow, disableTooltip, enableStopPropagation, followCursor} = this.props;
        if (disableTooltip) {
            return;
        }

        this.attempToStopPropagation(evt);

        !this.state.lastTipPosEvt && this.setState({lastTipPosEvt: evt});
        if (followCursor) {
            this.setState({
                hideTooltip: false
            });
        } else {
            this.setState({
                isCursorOver: true,
                lastTipPosEvt: evt
            }, this.debounceCheckShowingTooltip);
        }
    }

    handleMouseOutTarget(evt) {
        const {delayHide, disableTooltip, followCursor} = this.props;
        if (disableTooltip) {
            return;
        }

        this.attempToStopPropagation(evt);

        this.setState({
            isCursorMoving: false,
            isCursorOver: false
        });
        if (this.tooltip) {
            if (followCursor) {
                this.setState({
                    lastTipPosEvt: null,
                    hideTooltip: true
                });
            } else {
                _.delay(() => {
                    if (!this.state.isCursorOver) {
                        this.setState({
                            lastTipPosEvt: null,
                            hideTooltip: true
                        });
                    }
                }, delayHide);
            }
        }
    }
    handleMouseMoveOnTarget(evt) {
        const {disableTooltip, followCursor} = this.props;

        if (disableTooltip) {
            return;
        }

        this.attempToStopPropagation(evt);

        if (followCursor) {
            this.updateTooltipPosition(evt);
        } else {
            if (this.state.hideTooltip) {
                // this.updateTooltipPosition(evt);
                this.setState({
                    isCursorMoving: true,
                    lastTipPosEvt: evt
                }, () => {
                    this.debounceUpdateCursorStill();
                    this.debounceCheckShowingTooltip();
                });
            }
        }
    }

    handleMouseOutTooltip(evt) {
        const {delayHide, disableTooltip} = this.props;
        if (disableTooltip) {
            return;
        }

        this.attempToStopPropagation(evt);

        this.setState({
            isCursorMoving: false,
            isCursorOver: false
        });
        _.delay(() => {
            if (!this.state.isCursorOver) {
                this.setState({
                    lastTipPosEvt: null,
                    hideTooltip: true
                });
            }
        }, delayHide);
    }

    handleMouseOverTooltip(evt) {
        if (this.props.disableTooltip) {
            return;
        }

        this.attempToStopPropagation(evt);

        this.setState({
            isCursorMoving: true,
            isCursorOver: true
        }, this.debounceUpdateCursorStill);
    }

    handleMouseOutTooltip(evt) {
        const {delayHide, disableTooltip} = this.props;
        if (disableTooltip) { return; }

        this.setState({
            isCursorMoving: false,
            isCursorOver: false
        });
        _.delay(() => {
            if (!this.state.isCursorOver) {
                this.setState({
                    lastTipPosEvt: null,
                    hideTooltip: true
                });
            }
        }, delayHide);
    }
    handleMouseOverTooltip(evt) {
        if (this.props.disableTooltip) { return; }

        this.setState({
            isCursorMoving: true,
            isCursorOver: true
        }, this.debounceUpdateCursorStill);
    }

    updateTooltipPosition(evt) {
        if (!this.tooltip) {
            return;
        }
        const {
            placement,
            disableTooltip,
            tooltipMaxWidth,
            offsetTooltip,
            getTargetEl,
            arrowDirecton,
        } = this.props;

        let newLeft;
        let newTop;
        const targetEl = getTargetEl();

        if (this.isInfoTipMode() && evt) {
            newLeft = evt.clientX + 5;
            newTop = evt.clientY + 5;

            const fixedPos = fixPosIfOutOfBound(newLeft, newTop, this.tooltip);
            newLeft = fixedPos.left;
            newTop = fixedPos.top;
        } else if (targetEl) {
            const {
                top: targetTop,
                bottom: targetBottom,
                left: targetLeft,
                right: targetRight,
                width: targetWidth,
                height: targetHeight
            } = targetEl.getBoundingClientRect();

            const {
                width: tooltipWidth,
                height: tooltipHeight
            } = this.tooltip.getBoundingClientRect();

            const alignCenter = (targetALine, targetBLine, tooltipLine) => {
                return targetALine + (targetBLine / 2) - (tooltipLine / 2);
            }
            const getTopPos = () => {
                return targetTop - tooltipHeight;
            }
            const getRightPos = () => {
                return targetRight - tooltipWidth;
            }
            const getLeftPos = () => {
                return targetLeft - tooltipWidth;
            }
            const getBottomPos = () => {
                return targetBottom - tooltipHeight;
            }

            switch (placement) {
            case TOPLEFT:
                newTop = getTopPos();
                newLeft = targetLeft;
                break;
            case TOPRIGHT:
                newTop = getTopPos();
                newLeft = getRightPos();
                break;
            case BOTTOM:
                newTop = targetBottom;
                newLeft = alignCenter(targetLeft, targetWidth, tooltipWidth);
                break;
            case BOTTOMLEFT:
                newTop = targetBottom;
                newLeft = targetLeft;
                break;
            case BOTTOMRIGHT:
                newTop = targetBottom;
                newLeft = getRightPos();
                break;
            case LEFT:
                newTop = alignCenter(targetTop, targetHeight, tooltipHeight);
                newLeft = getLeftPos();
                break;
            case LEFTTOP:
                newTop = targetTop;
                newLeft = getLeftPos();
                break;
            case LEFTBOTTOM:
                newTop = getBottomPos();
                newLeft = getLeftPos();
                break;
            case RIGHT:
                newTop  = alignCenter(targetTop, targetHeight, tooltipHeight);
                newLeft = targetRight;
                break;
            case RIGHTTOP:
                newTop = targetTop;
                newLeft = targetRight;
                break;
            case RIGHTBOTTOM:
                newTop = getBottomPos();
                newLeft = targetRight;
                break;
            case TOP:
                if (arrowDirecton === LEFT) {
                    newTop = getTopPos();
                    newLeft = targetLeft;
                } else {
                    newTop = getTopPos();
                    newLeft = alignCenter(targetLeft, targetWidth, tooltipWidth);
                }
                break;
            default:
                newTop = getTopPos();
                newLeft = alignCenter(targetLeft, targetWidth, tooltipWidth);
            }
        }

        this.setState({
            tooltipX: Math.floor(newLeft + offsetTooltip.x),
            tooltipY: Math.floor(newTop + offsetTooltip.y)
        });
    }

    getStyle() {
        const {
            ifWrapText,
            tooltipMaxWidth,
            tooltipStyle,
            forceShow,
            fixedWidth
        } = this.props;

        const {
            tooltipX,
            tooltipY
        } = this.state;

        let displayStyle;
        if (this.isHiddenTooltip()) {
            displayStyle = {
                left: -1000,
                top: -1000,
                opacity: 0
            }
        } else {
            displayStyle = {
                left: tooltipX,
                top: tooltipY,
                opacity: 1
            }
        }

        return {
            whiteSpace: ifWrapText ? 'normal' : 'nowrap',
            maxWidth: ifWrapText ? tooltipMaxWidth : 'none',
            width: fixedWidth ? tooltipMaxWidth : 'auto',
            wordWrap: 'break-word',
            position: 'fixed',
            zIndex: 2000,
            display: 'inline-block',
            ...displayStyle,
            ...tooltipStyle
        };
    }

    isHiddenTooltip() {
        const {
            tooltipValue,
            forceShow,
            autoRender,
            show
        } = this.props;

        const {
            hideTooltip
        } = this.state;

        const isEmptyTooltip = !tooltipValue;

        if (!autoRender) {
            return !show;
        }

        if (this.isInfoTipMode()) {
            return hideTooltip || isEmptyTooltip;
        } else {
            return (hideTooltip || isEmptyTooltip) && forceShow !== true;
        }
    }

    getStaticTooltip() {
        const {
            placement,
            tooltipValue,
            arrowDirecton,
        } = this.props;
        const arrowClass = arrowDirecton === CENTER ? 'tooltip-arrow' : `tooltip-arrow ${arrowDirecton}`;

        return (
            <div
                className={classNames('tooltip', placement)}
                ref={(node) => this.tooltip = node}
                style={this.getStyle()} >
                <div className={`${arrowClass}`} />
                <div className='tooltip-inner'>
                    {tooltipValue}
                </div>
            </div>
        );
    }

    getDynamicToolTip() {
        return (
            <div
                className={classNames('tm-tooltip', this.props.tooltipClassName)}
                onMouseOut={this.handleMouseOutTooltip}
                onMouseOver={this.handleMouseOverTooltip}
                ref={(node) => this.tooltip = node}
                style={this.getStyle()}
                >
                {this.props.tooltipValue}
            </div>
        );
    }

    getPopoverTooltip() {
        const {placement, tooltipValue, popoverTitle} = this.props;

        return (
            <div
                className={classNames('popover', placement)}
                ref={(node) => this.tooltip = node}
                style={this.getStyle()} >
                <div className='arrow' />
                {(popoverTitle === '') ? null : <h3 className='popover-title'>{popoverTitle}</h3>}
                <div className='popover-content'>
                    {tooltipValue}
                </div>
            </div>
        );
    }

    getMouseEventOpts() {
        return {
            onMouseOver: this.handleMouseOverTarget,
            onMouseOut: this.handleMouseOutTarget,
            onMouseMove: this.handleMouseMoveOnTarget
        };
    }

    renderTooltip() {
        const {mode} = this.props;

        if (mode === POPOVER) {
            return this.getPopoverTooltip();
        } else if (mode === TOOLTIP) {
            return this.getStaticTooltip();
        } else {
            // default cursor/info tooltip
            return null;
        }
    }

    render() {
        const { className, displayValue } = this.props;
        const isInfoTipMode = this.isInfoTipMode();

        if (isInfoTipMode) {
            return null;
        }

        return (
            <span
                className={classNames('tm-tooltip-container', className)}
                style={{position: 'relative'}}
                ref={(node) => this.tooltipContainer = node}
                >
                {displayValue}
                {this.renderTooltip()}
            </span>
        )
    }
}

export default Tooltip;
