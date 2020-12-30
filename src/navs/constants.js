import PropTypes from 'prop-types';
import React from 'react';

export const ItemPropType = PropTypes.shape({
    href: PropTypes.string,
    value: PropTypes.any,
    noDnD: PropTypes.bool, // noDnD means: 1. order cannot be changed
                                 //              2. no one use it to reorder
    ButtonClass: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    subMenu: PropTypes.array,
    text: PropTypes.node
});

export const ItemsPropType = PropTypes.arrayOf(ItemPropType);

export const bsStyleNavTabsPropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
]);
