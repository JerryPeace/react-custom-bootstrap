import _ from 'lodash';

export const escapeSpace = (s) => (_.isString(s) ? _.replace(s, /  /gm, ' \u00a0') : s);

export default {
    escapeSpace
};
