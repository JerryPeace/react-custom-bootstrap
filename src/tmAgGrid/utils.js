import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import naturalSort from 'natural-sort';

export const getGridHeight = (_dataAry, _maxRows=10, _cellHeight=36, _rowHeightCalFunc, scrollYButterHeight=15, _defalutGridHeight=110, _paginationHeight=51) => {
    const BUFFER_HEIGHT = scrollYButterHeight;
    const EMPTY_HEIGHT = _defalutGridHeight;
    const HEADER_HEIGHT = 36;
    const MAX_ROWS = _maxRows;
    const MAX_HEIGHT = (MAX_ROWS + 1) * _cellHeight;

    let height = EMPTY_HEIGHT,
        bodyHeight;

    if (_.isArray(_dataAry)) {
        if (_rowHeightCalFunc) {
            bodyHeight = _.sum(_.map(_.slice(_dataAry, 0, _maxRows), _row => _rowHeightCalFunc({data: _row})));

            height = bodyHeight + HEADER_HEIGHT + BUFFER_HEIGHT;
        } else {
            if (_dataAry.length > 0 && (_dataAry.length+1)*_cellHeight <= MAX_HEIGHT) {
                // height = (_dataAry.length+1)*_cellHeight + BUFFER_HEIGHT;
                height = (_dataAry.length + 1) * _cellHeight;
            } else if ((_dataAry.length+1)*_cellHeight > MAX_HEIGHT) {
                height = MAX_HEIGHT;
            }
        }
    }
    height += _paginationHeight;
    return height + 'px';
};

export const reactHeaderClassRendererFactory = (reactComponent, cell='span') => (params) => {
    const eCell = document.createElement(cell);
    var component = React.createElement(reactComponent, params);
    ReactDOM.render(component, eCell);
    return eCell;
};

export const gridDefaultSort = (allRowData, column, direction, primarySortKey) => (
    _.isArray(column)
    ? listDefaultSort(allRowData, [primarySortKey, ...column], ['desc', ...direction])
    : listDefaultSort(allRowData, [primarySortKey, column], ['desc', direction])
);

export const listDefaultSort = (list, _keys, _directions) => {
    const data = _.cloneDeep(list);
    const keys = Array.isArray(_keys) ? _keys : [_keys];
    const directions = Array.isArray(_directions) ? _directions
                                                  : _.fill(Array(keys.length), _directions);

    if (!_keys && !_directions) {
        // without keys and directions.
        data.sort(naturalSort({ caseSensitive: false, direction: 'asc' }));
        return data;
    }

    // handle keys and directions
    _.each(keys, (key, idx) => {
        const sortingFunc = naturalSort({
            caseSensitive: false,
            direction: directions[idx] || 'asc'
        });

        data.sort((a, b) => {
            let valueA;
            let valueB;
            if (_.isFunction(key)) {
                valueA = key(a);
                valueB = key(b);
            } else {
                valueA = _.get(a, key);
                valueB = _.get(b, key);

                valueA = valueA !== undefined && valueA !== null ? valueA : '';
                valueB = valueB !== undefined && valueB !== null ? valueB : '';
            }
            return sortingFunc(valueA, valueB);
        });
    });
    return data;
};

export const eventController = (() => {
    let eventHandlerList = {};
    return {
        add: (eventID, el, eventName, eventHandler) => {
            el.addEventListener(eventName, eventHandler);
            eventHandlerList[eventID] = {
                el,
                eventName,
                eventHandler
            };
        },
        remove: (eventID) => {
            if (!eventHandlerList[eventID]) {
                return;
            }

            const {
                el,
                eventName,
                eventHandler
            } = eventHandlerList[eventID];
            el.removeEventListener(eventName, eventHandler);
            delete eventHandlerList[eventID];
        }
    };
})();
