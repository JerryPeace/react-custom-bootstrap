import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bootstrapUtils from '../utils/bootstrapUtils';

class Breadcrumb extends React.Component {

    static propTypes = {
        onClickHelp: PropTypes.func,
        hasHelp: PropTypes.bool,
        bsClass: PropTypes.string
    };

    static defaultProps = {
        bsClass: 'breadcrumb',
        hasHelp: false
    };

    constructor (props) {
        super(props);
        this.onClickHelp = this.onClickHelp.bind(this);
    }

    renderHelpButton() {
        return (
            <li className='icon-help'
                onClick={this.onClickHelp}>
            </li>
        );
    }

    onClickHelp(e) {
        // e.preventDefault();
        // console.log('click onClickHelp.');

        if ( !! this.props.onClickHelp ) {
            this.props.onClickHelp();
        }
    }

    render() {
        const {bsClass, hasHelp, onClickHelp, ...rest} = this.props;
        let _hasHelp = hasHelp || !!onClickHelp;
        let bsCls = bootstrapUtils.getCls(this.props);

        return (
            <ul {...rest} className={classNames(this.props.className, bsCls)}>
                {this.props.children}
                {_hasHelp ? this.renderHelpButton() : null}
            </ul>
        );
    }
}

export default Breadcrumb;
