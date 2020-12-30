import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';
import CustomPropTypes from '../utils/CustomPropTypes';
import styleMaps from '../styleMaps';

class Loader extends React.Component {

    static propTypes = {
        loaderText: PropTypes.string,
        bsSize: CustomPropTypes.keyOf(styleMaps.SIZES),
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'tm-loader',
        bsSize: 'sm'
    };

    renderContent() {
        const {loaderText, children} = this.props;
        if (loaderText || children) {
            return (
                <span className={styleMaps.CLASSES['loader-content']}>
                    {loaderText}
                    {children}
                </span>
            );
        } else {
            return null;
        }
    }

    render() {
        const {className, bsClass, bsSize, loaderText, children, ...props} = this.props;
        const bsCls = bootstrapUtils.getCls(this.props);
        return (
            <span className={classNames('loader', className)} {...props}>
                <span className={classNames(bsCls)} />
                {this.renderContent()}
            </span>
        );
    }
}

export default Loader;
