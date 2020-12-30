import React from 'react';
import Modal from 'modal';
import { mount } from 'enzyme';

describe('Modal', () => {
    let modal;
    let mockClose;
    let nodeProps;

    describe('with header/body/footer props', () => {
        beforeEach(() => {
            mockClose = jest.fn();
            nodeProps = {
                header: 'This is header.',
                body: 'This is body.',
                footer: 'This is footer.',
                onClose: mockClose
            };
            modal = mount(<Modal {...nodeProps} />);
        });

        test('should render corrently', () => {
            expect(modal).toMatchSnapshot();
        });

        test('click on close should hide modal', () => {
            modal.find('.close').simulate('click');
            expect(mockClose.mock.calls.length).toBe(1);
            expect(modal).toMatchSnapshot();
        });
    });

    describe('with show prop', () => {
        beforeEach(() => {
            nodeProps = {
                closeBtn: false,
                header: 'This is header.',
                body: 'This is body.',
                footer: 'This is footer.',
                show: true
            };
            modal = mount(<Modal {...nodeProps} />);
        });

        test('should render corrently', () => {
            expect(modal).toMatchSnapshot();
        });

        test('should hide after toggle show prop', () => {
            modal.setProps({show: false});
            expect(modal).toMatchSnapshot();
        });
    });
});
