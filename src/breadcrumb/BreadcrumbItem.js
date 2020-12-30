import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class BreadcrumbItem extends React.Component {

    static propTypes = {
        active: PropTypes.bool
    };

    static defaultProps = {
        active: false
    };

    constructor (props) {
        super(props);
    }

    render() {
        const {active, children, ...rest} = this.props;
        // add specific classes
        let classes = {
            'active': active
        };

        let bsCls = bootstrapUtils.getCls(this.props);

        if (active) {
            return (
                <li {...rest} className={classNames(this.props.className, classes, bsCls)}>
                    {children}
                </li>
            );
        } else {
            return (
                <li {...rest} className={classNames(this.props.className, classes)}>
                    {children}
                </li>
            );
        }
    }

}

export default BreadcrumbItem;
