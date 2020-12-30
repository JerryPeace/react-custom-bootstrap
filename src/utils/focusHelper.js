export const blurActive = () => {
    // According to MDN, activeElement may be null and it happens at IE 11. We should
    // check activeElement and its blur function before calling it. (PIX-6018)
    document.activeElement
    && _.isFunction(document.activeElement.blur)
    && document.activeElement.blur();
};

export default {
    blurActive
};
