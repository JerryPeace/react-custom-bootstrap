import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styleMaps from '../styleMaps';
import bootstrapUtils from '../utils/bootstrapUtils';

class FormPanel extends React.Component {
    static propTypes = {
        itemsConfig: PropTypes.object
    };

    static defaultProps = {
        bsClass: 'form',
        bsStyle: 'horizontal',
        itemsConfig: {
            standalone: false
        }
    };

    render() {
        const {
            children,
            itemsConfig,
            ...props
        } = this.props;
        const bsCls = bootstrapUtils.getCls(props);
        let newChildren;

        if (!itemsConfig) {
            newChildren = children;
        } else {
            newChildren = React.Children.map(children, function (child) {
                if (React.isValidElement(child) && typeof child.type === 'function') {
                    return React.cloneElement(child, itemsConfig);
                }
                return child;
            });
        }

        return (
            <form className={classNames(this.props.className, bsCls)}>
                {newChildren}
            </form>
        );
    }
}

export default FormPanel;
