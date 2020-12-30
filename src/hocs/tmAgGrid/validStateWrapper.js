import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const validStateWrapper = (CellComponent) => {
    return class ValidStateCell extends Component {
        static propTypes = {
            validator: PropTypes.func
        };

        render() {
            const inValidClass = 'is-invalid';
            const validator = this.props.validator;

            return (
                <div className={classNames({
                    [inValidClass]: validator && (validator(this.props) !== true)
                })}>
                    <CellComponent {...this.props} />
                </div>
            );
        }
    };
}

export default validStateWrapper;
