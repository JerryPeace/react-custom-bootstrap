import PropTypes from 'prop-types';
import React, { Component } from 'react';

class SubMenu extends Component {

    static propTypes = {
        toggleSubMenu: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.handleSubMenuClick = ::this.handleSubMenuClick;
    }

    handleSubMenuClick(evt) {
        let tabbable = this.div;
        let offsetLeft = 0;
        let offsetTop = 0;

        while(tabbable && tabbable.className.indexOf('tabbable') < 0) {
            offsetLeft += (tabbable.offsetLeft - tabbable.scrollLeft);
            offsetTop += (tabbable.offsetTop - tabbable.scrollTop);
            tabbable = tabbable.parentNode;
        }

        this.props.toggleSubMenu(offsetTop + this.div.offsetHeight, offsetLeft);
        evt.stopPropagation();
    }

    render() {
        return (
            <div className='submenu' ref={(r) => this.div = r}>
                <a className='fa fa-angle-down' onClick={this.handleSubMenuClick}/>
            </div>
        );
    }
}

export default SubMenu;
