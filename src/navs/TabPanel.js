import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class TabPanel extends React.Component {

    static propTypes = {
        active: PropTypes.bool
    };

    static defaultProps = {
        bsClass: 'tab-pane'
    };

    render() {
        const activeCls = this.props.active ? 'active' : '';
        const bsCls = bootstrapUtils.getCls(this.props);

        return (
            <div className={classNames(this.props.className, activeCls, bsCls)}>
                {this.props.children}
            </div>
        );
    }
}

export default TabPanel;
