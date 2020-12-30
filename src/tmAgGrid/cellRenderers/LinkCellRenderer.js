import React from 'react';
import TooltipHelper from '../../tooltip/TooltipHelper';
import { escapeSpace } from '../../utils/stringUtils';

const GENERIC_CELL_TOOLTIP_MAX_WIDTH = 600;

const LinkCellRenderer = (onClick, showTooltip=true) => (props) => {
    const { data, value } = props;
    const handleClicked = (e) => {
        // We don't need to check onClick because we use it as the flag to check if we need to show
        // a link.
        onClick(data, e);
    };

    const escapedValue = escapeSpace(value);

    const node = onClick
                 ? (
                    <a className='no-select link-cell-anchor' onClick={handleClicked}>
                        {escapedValue}
                    </a>
                ) : (<span>{escapedValue}</span>);

    return showTooltip
            ? (
                <TooltipHelper
                    ifWrapText={true}
                    tooltipMaxWidth={GENERIC_CELL_TOOLTIP_MAX_WIDTH}
                    tooltipValue={escapedValue}
                    >
                    {node}
                </TooltipHelper>
              )
            : node;
};

export default LinkCellRenderer;
