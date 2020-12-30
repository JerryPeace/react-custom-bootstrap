import PropTypes from 'prop-types';
import React from 'react';
import bootstrapUtils from '../utils/bootstrapUtils';
import Glyphicon from '../glyphicon/Glyphicon'
import styleMaps from '../styleMaps';
import classNames from 'classnames';

class HelpText extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'help-block'
    };

    render() {
        const {text, className, children, ...props} = this.props,
            bsCls = bootstrapUtils.getCls(props);

        return (
            <div className={classNames(className)}>
                <span className={classNames('msg', bsCls)}>
                    {text}
                    {children}
                </span>
            </div>
        );
    }
}

export default HelpText;
