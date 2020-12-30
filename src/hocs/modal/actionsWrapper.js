import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import Button from '../../button/Button';

export default (Modal) => {
    return class ActionsWrappedDialog extends Component {

        static propTypes = {
            actionButtonProps: PropTypes.object,
            body: PropTypes.node,
            buttonsProps: PropTypes.array,
            cancelButtonProps: PropTypes.object,
            loading: PropTypes.bool,
            dialogClassName: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.object
            ]),
            footer: PropTypes.node
        };

        renderFooter() {
            const {
                actionButtonProps,
                buttonsProps,
                cancelButtonProps,
                footer,
                className
            } = this.props;

            return (
                <section className='actions-footer-group'>
                    {footer}
                    {_.map(buttonsProps, (props) => (<Button {...props} />))}
                    {actionButtonProps &&
                        <Button className='action-button' {...actionButtonProps} />
                    }
                    {cancelButtonProps &&
                        <Button className='cancel-button' {...cancelButtonProps} />
                    }
                </section>
            );
        }

        render() {
            const {
                body,
                children,
                dialogClassName,
                loading,
                ...restProps
            } = this.props;
            // We use body as header and put the original body as the children.
            return (
                <Modal
                    {...restProps}
                    dialogClassName={classNames(dialogClassName, { 'tm-loading': loading })}
                    footer={this.renderFooter()}
                    >
                    {body}
                    {children}
                </Modal>
            );
        }
    }
};

