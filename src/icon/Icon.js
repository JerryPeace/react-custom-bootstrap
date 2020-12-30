import PropTypes from 'prop-types';
import React from 'react';

class Icon extends React.Component {
    static propTypes = {
        /**
         * icon type
         */
        src: PropTypes.string.isRequired
    };

    render() {
        return (
            <img className='tm-button-icon' src={this.props.src}>
                {this.props.children}
            </img>
        );
    }
}


export default Icon;
