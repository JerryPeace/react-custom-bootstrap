import PropTypes from 'prop-types';
import React from 'react';
import shallowCompare from '../utils/shallowCompare'

export class Basic extends React.Component {
    /*
    ** labelAlign: label can be left or right to the field
    ** labelText: A string or label for label
    ** items: It's for children items as like CheckboxGroup, RadioGroup, select class
    ** inline: An inline style option for radio, checkbox clss
    ** standalone: An option (false) for wrapper fields with class control-group and controls
    */
    static propTypes = {
        labelAlign: PropTypes.oneOf(['right', 'left']),
        labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        items: PropTypes.array,
        inline: PropTypes.bool,
        standalone: PropTypes.bool,
        disableDirtyCheck: PropTypes.bool
    };

    static defaultProps = {
        disableDirtyCheck: false
    };

    constructor(props) {
        super(props);
        this.isDirty = ::this.isDirty;
        this.cleanDirty = ::this.cleanDirty;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    isDirty() {
        if (this.props.disableDirtyCheck) {
            return false;
        }
        return this.originalVal !== this.getValue();
    }

    cleanDirty() {
        this.originalVal = this.getValue();
    }
}
