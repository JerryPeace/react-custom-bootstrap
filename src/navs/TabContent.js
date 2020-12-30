import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import TabPanel from './TabPanel';

class TabContent extends React.Component {
    static propTypes = {
        activeTab: PropTypes.any,
        items: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any
        }))
    };

    static defaultProps = {
        bsClass: 'tab-content'
    };

    renderChildren(items, children, activeTab) {
        if (!children) {
            // no child
            return null;
        } else if (children instanceof Array) {
            // a lot of children
            return children.map(function (child, index) {
                const item = items[index];
                return (
                    <TabPanel
                        key={'tab-' + (child.key || index)}
                        active={activeTab === item.value}>
                        {child}
                    </TabPanel>
                );
            });
        } else {
            // a child
            return (<TabPanel
                active={activeTab === items[0].value}>
                {children}
            </TabPanel>);
        }
    }

    render() {
        const {
            activeTab,
            children,
            className,
            items
        } = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);

        const child = this.renderChildren(items, children, activeTab);

        return (<div className={classNames(className, bsCls)}>{child}</div>);
    }
}

export default TabContent;
