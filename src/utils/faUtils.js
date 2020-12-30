import classNames from 'classnames';

const faUtils = {
    getCls(props) {
        const faClass = 'fa';
        return !!props.faStyle ? classNames(faClass, faClass + '-' + props.faStyle) : '';
    }
};

export default faUtils;
