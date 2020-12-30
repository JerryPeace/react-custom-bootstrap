import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class Badge extends React.Component {
    static propTypes = {
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'badge'
    };

    render() {
        const {bsClass, ...rest} = this.props;
        let bsCls = bootstrapUtils.getCls(this.props);

        return (
            <span {...rest} className={classNames(this.props.className, bsCls)}>
                {this.props.children}
            </span>
        );
    }
}

export default Badge;
