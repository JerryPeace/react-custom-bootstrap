import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import CaretIcon from './CaretIcon';

class Header extends React.Component {

    static propTypes = {
        handleCollapse: PropTypes.func,
        collapsed: PropTypes.bool,
        titleText: PropTypes.string.isRequired,
        href: PropTypes.string,
    };

    static defaultProps = {
        collapsed: false
    };

    constructor (props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    renderTitle() {
        // add specific classes
        let classes = {
            'tm-accordion-toggle': true,
            'collapsed': this.props.collapsed
        };
        let inlineStyle = {
            cursor: 'pointer'
        };
        return (
            <a
                className={classNames(this.props.className, classes)}
                href={this.props.href}
                onClick={this.onClick}
                style={inlineStyle}>
                <CaretIcon />{this.props.titleText}
            </a>
        );
    }

    onClick(e) {
        e.preventDefault();

        // console.log('click onClick.');
        // console.log(e);

        if ( !! this.props.handleCollapse ) {
            this.props.handleCollapse();
        }
    }

    render() {
        return (
            <div {...this.props} className='tm-accordion-heading'>
                {this.renderTitle()}
            </div>
        );
    }
}

export default Header;

