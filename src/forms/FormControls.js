import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class FormControls extends React.Component {
    static defaultProps = {
        bsClass: 'controls'
    };

    render() {
        const props = this.props;
        let cls = bootstrapUtils.getCls(props);

        return (
            <div className={classNames(props.className, cls)}>
                {props.children}
            </div>
        )
    }
}

export default FormControls;

