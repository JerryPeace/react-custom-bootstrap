import PropTypes from 'prop-types';
import React from 'react';
import bootstrapUtils from '../utils/bootstrapUtils';
import classNames from 'classnames';

class Glyphicon extends React.Component {

    static propTypes = {
        /**
         * icon type
         */
        bsStyle: PropTypes.string.isRequired,
        ariaHidden: PropTypes.bool
    };

    static defaultProps = {
        bsClass: 'glyphicon',
        ariaHidden: true
    };

    render() {
        const { className, ariaHidden } = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);
        return (<span className={classNames(className, bsCls)} aria-hidden={ariaHidden} />);
    }
}


export default Glyphicon;
