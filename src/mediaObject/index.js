import PropTypes from 'prop-types';
import React from 'react';

class MediaObject extends React.Component {
    static propTypes = {
        content: PropTypes.node,
        image: PropTypes.node,
        titleText: PropTypes.node
    };

    render() {
        const {
            children,
            content,
            image,
            titleText
        } = this.props;

        return (
            <div className='media-obj'>
                <div className='leading-img'>
                    {image}
                </div>
                <div className='media-content'>
                    <div className='media-header'>
                        {titleText}
                    </div>
                    {content}
                    {children}
                </div>
            </div>
        );
    }
}


export default MediaObject;
