import React from 'react';
import { mount } from 'enzyme';
import CloseIcon from 'icon/CloseIcon';

describe('CloseIcon', () => {
    let onClick;
    let target;

    beforeEach(() => {
        onClick = jest.fn();
        target = mount(<CloseIcon onClick={onClick}/>);

    });

    test('render CloseIcon correctly', () => {
        expect(target).toMatchSnapshot();
    });

    test('click on link', () => {
        target.find('a.close').simulate('click');
        expect(onClick.mock.calls.length).toBe(1);
    });
});
