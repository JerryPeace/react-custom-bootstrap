import React from 'react';
import classNames from 'classnames';

class FormActions extends React.Component {
    render() {
        const {
            className,
            children
        } = this.props;

        return (
            <div className={classNames('tm-form-actions', className)}>
                {children}
            </div>
        )
    }
}

export default FormActions;

