import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

class Body extends React.Component {

    static propTypes = {
        collapsed: PropTypes.bool
    };

    static defaultProps = {
        collapsed: false
    };

    constructor (props) {
        super(props);
    }

    render() {

        // add specific classes
        let classes = {
            'tm-accordion-body': true,
            'collapse': true,
            'in': !this.props.collapsed
        };

        return (
            <div {...this.props} className={classNames(this.props.className, classes)}>
                <div className='tm-accordion-inner'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Body;
