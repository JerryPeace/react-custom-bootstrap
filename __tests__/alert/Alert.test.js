import React from 'react';
import { mount } from 'enzyme';
import toJSON from'enzyme-to-json';
import Alert from 'alert/Alert';

describe('Alert', () => {
    let alert;

    describe('with default settings', () => {
        beforeEach(() => {
            alert = mount(<Alert titleText='title-text'>alert-message</Alert>);
        });

        test('should render corrently', () => {
            expect(toJSON(alert)).toMatchSnapshot();
        });

        test('should close it while clicking close button', () => {
            // find close icon
            const closeIcon = alert.find('CloseIcon');
            expect(closeIcon.exists()).toBeTruthy();
            // click it
            closeIcon.simulate('click');
            alert.update();
            // it should hide the alert
            expect(alert.state('alertVisible')).toBeFalsy();
            expect(toJSON(alert)).toMatchSnapshot();
        });
    });

    describe('with onClose callback', () => {
        let onClose;

        beforeEach(() => {
            onClose = jest.fn();
            alert = mount(<Alert titleText='title-text-with-close' onClose={onClose}>
                alert-message</Alert>);
        });

        test('should render corrently', () => {
            expect(toJSON(alert)).toMatchSnapshot();
        });

        test('should call onClose callback while clicking on it', () => {
             // find close icon
            const closeIcon = alert.find('CloseIcon');
            expect(closeIcon.exists()).toBeTruthy();
            // click it
            closeIcon.simulate('click');
            alert.update();
            expect(alert.state('alertVisible')).toBeFalsy();
            expect(toJSON(alert)).toMatchSnapshot();
            expect(onClose.mock.calls.length).toBe(1);
        });
    });

    describe('with in different styles', () => {
        const styles = ['success', 'info', 'warning', 'danger'];

        styles.forEach((style) => {
            test('should render the style with ' + style, () => {
                alert = mount(<Alert titleText='title-text-with-style' bsStyle={style}>
                    alert-message</Alert>);
                expect(alert.find('.alert-' + style).exists()).toBeTruthy();
            });
        });
    });

    test('toast alert should contains toast-alert class name', () => {
        alert = mount(<Alert type='toast' titleText='title-text'>alert-message</Alert>);
        expect(toJSON(alert)).toMatchSnapshot();
    });
});
