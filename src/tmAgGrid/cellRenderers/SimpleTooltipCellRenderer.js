import PropTypes from 'prop-types';
import React from 'react';
import TooltipHelper from '../../tooltip/TooltipHelper';
import { escapeSpace } from '../../utils/stringUtils';

/**
    * @param {object or function} hocArgs

    * if typeof hocArgs === 'object'
    * @param hocArgs.customRender {func}
    *        - optional
    *        - with argument of params.data from ag-grid cell and getOpts to get data from view
    *        - return string or element to display
    * @param hocArgs.customRender {func}
    *        - optional
    *        - with argument of params.data from ag-grid cell and getOpts to get data from view
    *        - return string or element to display
    * @param hocArgs.emptyNode {string, number, node}
    *        - optional
    *        - props for render empty when no value or return nothing from customRender
    * @param hocArgs.tooltipRender {func}
    *        - optional
    *        - with argument of params.data from ag-grid cell and getOpts to get data from view
    *        - return string or element to display tooltip contents
    * @param hocArgs.getOpts {func}
    *        - optional
    *        - return any data from view

    * if typeof hocArgs === 'function'
    * hocArgs would be treated as customRender
**/
export const simpleTooltipCell = (hocArgs = {}) => {
    const wrappered = (props) => {
        const { data, value } = props;
        const customRender = typeof hocArgs === 'function' ? hocArgs : hocArgs.customRender;
        const {
            emptyNode,
            getOpts,
            tooltipRender
        } = hocArgs;
        const tooltipProps = hocArgs.tooltipProps || {};

        if (emptyNode && (!value || (customRender && !customRender(value, data, getOpts)))) {
            return <span>{emptyNode}</span>;
        }

        const display = customRender ? customRender(value, data, getOpts)
                                     : <span>{escapeSpace(value)}</span>;
        const tooltipValue = tooltipRender ? tooltipRender(value, data, getOpts) : display;
        const defaultTipProps = {
            ifWrapText: true,
            mode: 'infotip',
            tooltipValue
        };
        return _.isNull(tooltipValue)
               ? display
               : <TooltipHelper {...defaultTipProps} {...tooltipProps}>{display}</TooltipHelper>;
    };
    wrappered.propTypes = {
        data: PropTypes.any,
        value: PropTypes.any
    };
    return wrappered;
}

simpleTooltipCell.propTypes = {
    hocArgs: PropTypes.object
};

const MULTILINE_ARGS = {
    tooltipProps: {
        followCursor: false,
        tooltipStyle: {
            maxHeight: 300,
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
        }
    }
};
export const multilineTooltipCell = simpleTooltipCell(MULTILINE_ARGS);
