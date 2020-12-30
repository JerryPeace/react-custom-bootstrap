import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import Header from './GroupHeader';
import Body from './GroupBody';

class CollapseGroup extends React.Component {

    static propTypes = {
        collapsed: PropTypes.bool,
        titleText: PropTypes.string,
        handleCollapse: PropTypes.func,
    };

    static defaultProps = {
        bsClass: 'collapse-group',
        collapsed: false
    };

    constructor (props) {
        super(props);
        this.handleCollapse = this.handleCollapse.bind(this);
    }

    handleCollapse() {
        if (this.props.handleCollapse) {
            this.props.handleCollapse(this);
        }
    }

    render() {
        let bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div {...this.props} className={classNames(this.props.className, bsCls)}>
                <Header
                    titleText={this.props.titleText}
                    collapsed={this.props.collapsed}
                    handleCollapse={this.handleCollapse} />
                <Body collapsed={this.props.collapsed}>
                    {this.props.children}
                </Body>
            </div>
        );
    }
}

export default CollapseGroup;
