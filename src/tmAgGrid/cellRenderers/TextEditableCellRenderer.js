import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import styleMaps from '../../styleMaps';
import validStateWrapper from '../../hocs/tmAgGrid/validStateWrapper';

class TextEditableCellRenderer extends Component {
    static propTypes = {
        value: PropTypes.any,
        customRenderer: PropTypes.func,
        defaultRenderer: PropTypes.func,
        displayRenderer: PropTypes.func
    };

    static defaultProps = {
        validator: () => true,
        defaultRenderer: (props) => {
            const {
                className,
                displayRenderer
            } = props;

            return (
                <div className={classNames(className, `${styleMaps.CLASSES.tm}-editable-text`)} >
                    {displayRenderer(props)}
                </div>
            );
        },
        displayRenderer: ({ value }) => (value)
    };

    render() {
        const {
            customRenderer,
            defaultRenderer
        } = this.props;

        return customRenderer ? customRenderer(this.props) : defaultRenderer(this.props);
    }
}

export default validStateWrapper(TextEditableCellRenderer);
