import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TmTooltip from './TmTooltip';

class TooltipHelper extends Component {
    static propTypes = {
        value: PropTypes.node,
        tooltipValue: PropTypes.node,
        wrapperClassName: PropTypes.string,
        title: PropTypes.node
    };

    constructor(props) {
        super(props);
        this._content = null;
        this.state = {
            isContentMounted: false
        };
    }

    componentDidMount() {
        this.setState({
            isContentMounted: true
        });
    }

    render() {
        const {
            value,
            tooltipValue,
            wrapperClassName,
            children,
            title,
            ...rest
        } = this.props;

        return (
            <span className={wrapperClassName}>
                <span ref={(el) => this._content = el}>
                    {value}
                    {children}
                </span>
                {this.state.isContentMounted && (
                    <TmTooltip
                        {...rest}
                        tooltipValue={tooltipValue || title || value || children}
                        getTargetEl={() => this._content}
                    />
                )}
            </span>
        );
    }
}

export default TooltipHelper;
