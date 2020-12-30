import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Alert from '../../alert/Alert';

export default (Modal) => {
    return class ToastWrappedDialog extends Component {

        static propTypes = {
            body: PropTypes.node,
            modalAlerts: PropTypes.array,
            onModalAlertClosed: PropTypes.func,
            extraNode: PropTypes.node
        };

        renderAlerts() {
            const {
                extraNode,
                modalAlerts,
                onModalAlertClosed
            } = this.props;
            if (!modalAlerts) {
                return null;
            }
            return (
                <section className='toast-extra-nodes-group'>
                    <section className='dialog-toasts alert-group'>
                        {_.map(modalAlerts, (item) => {
                            const handleClosed = () => {
                                onModalAlertClosed && onModalAlertClosed(item.id)
                            };
                            return (
                                <Alert
                                    key={item.id}
                                    bsStyle={item.type}
                                    isShortMsg={true}
                                    onClose={handleClosed}>
                                    {item.message}
                                </Alert>
                            );
                        })}
                    </section>
                    {extraNode}
                </section>
            );
        }

        render() {
            const {
                body,
                children,
                ...restProps
            } = this.props;
            // We use body as header and put the original body as the children.
            return (
                <Modal {...restProps} extraNode={this.renderAlerts()}>
                    {body}
                    {children}
                </Modal>
            );
        }
    }
};

