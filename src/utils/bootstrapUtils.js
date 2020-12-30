import styleMaps from '../styleMaps';

const bootstrapUtils = {
    getCls(props) {
        const classes = {};
        const bsClass = props.bsClass && styleMaps.CLASSES[props.bsClass];

        if (bsClass) {
            classes[bsClass] = true;

            const prefix = bsClass + '-';
            const bsSize = props.bsSize && styleMaps.SIZES[props.bsSize];

            if (bsSize) {
                classes[prefix + bsSize] = true;
            }

            const bsStyle = props.bsStyle;

            if (bsStyle) {
                const bsStyleList = Array.isArray(bsStyle) ? bsStyle : [bsStyle];

                bsStyleList.map(function(cls) {
                    classes[styleMaps.STYLES.indexOf(cls) > -1 ? prefix + cls : cls] = true;
                });
            }
        }

        return classes;
    }
}

export default bootstrapUtils;
