import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styleMaps from '../styleMaps';
import CustomPropTypes from './CustomPropTypes';

let addBootstrapMixin = (Component) => (class extends React.Component {

    static propTypes = {
        /**
         * bootstrap className
         * @private
         */
        bsClass: CustomPropTypes.keyOf(styleMaps.CLASSES),
        /**
         * Style variants
         * @type {("default"|"primary"|"success"|"info"|"warning"|"danger"|"link")}
         */
        bsStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string
        ]),
        /**
         * Size variants
         * @type {("xsmall"|"small"|"medium"|"large"|"xs"|"sm"|"md"|"lg")}
         */
        bsSize: CustomPropTypes.keyOf(styleMaps.SIZES)
    };

    static defaultProps = {
        // hijack child default props
        ...Component.defaultProps
    };

    getBsClassSet(defaultProps) {
        let classes = {};
        let bsClass = this.props.bsClass && styleMaps.CLASSES[this.props.bsClass];
        if (bsClass) {

            classes[bsClass] = true;

            let prefix = bsClass + '-';

            let bsSize = this.props.bsSize && styleMaps.SIZES[this.props.bsSize];
            if (bsSize) {
                classes[prefix + bsSize] = true;
            }

            let bsStyle = this.props.bsStyle,
                bsStyleList = [];

            if (Array.isArray(bsStyle)) {
                bsStyleList = bsStyle;
            } else {
                bsStyleList.push(bsStyle);
            }

            if (bsStyle) {
                bsStyleList.map(function(cls) {
                    if (styleMaps.STYLES.indexOf(cls) >= 0) {
                        classes[prefix + cls] = true;
                    } else {
                        classes[cls] = true;
                    }
                });
            }
        }

        return classes;
    }

    getCom() {
        return this.refs.com;
    }

    getValue() {
        return this.getCom().getValue();
    }

    render() {
        let classes = this.getBsClassSet(this.props);

        return (
            <Component
                ref={'com'}
                {...this.props}
                className={classNames(this.props.className, classes)} />
        );
    }

})

export default addBootstrapMixin;
