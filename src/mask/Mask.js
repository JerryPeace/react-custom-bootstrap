import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Loader from '../loader/Loader';

class Mask extends Component {
    static propTypes = {
        show: PropTypes.bool,
        isLoading: PropTypes.bool,
        loaderProps: PropTypes.object
    };

    static defaultProps = {
        show: true,
        loaderProps: {
            bsSize: 'md'
        }
    };

    render() {
        if (this.props.show !== true) {
            return null;
        }

        const {
            className,
            children,
            isLoading,
            loaderProps
        } = this.props;

        return (
            <div className={classNames('tm-mask', className)}>
                <div>
                    {isLoading && <Loader {...loaderProps} />}
                    {children}
                </div>
            </div>
        );
    }
}

export default Mask;
