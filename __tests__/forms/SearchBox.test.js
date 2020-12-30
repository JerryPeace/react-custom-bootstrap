import React from 'react';
import {mount} from 'enzyme';
import SearchBox from 'forms/searchBox';

const defaultValue = 'defaultValue';

describe('SearchBox', () => {
    let searchBox;
    test('should render corrently', () => {
        searchBox = mount(<SearchBox defaultValue={defaultValue} />);
        expect(searchBox).toMatchSnapshot();
    });

    test('could show search button', () => {
        searchBox = mount(<SearchBox displaySearchBtn={true} />);
        expect(searchBox).toMatchSnapshot();
    });

    test('could hide search button', () => {
        searchBox = mount(<SearchBox displaySearchBtn={false} />);
        expect(searchBox).toMatchSnapshot();
    });

    describe('could call onSearch successfully', () => {
        let searchFn;
        beforeEach(() => {
            searchFn = jest.fn();
            searchBox = mount(<SearchBox displaySearchBtn={true} onSearch={searchFn} />);
        });
        test('by search button', () => {
            searchBox.find('button').simulate('click');
            expect(searchFn.mock.calls.length).toBe(1);
        });
        test('by typing "Enter"', () => {
            searchBox.find('input').simulate('keyUp', {keyCode: 13});
            expect(searchFn.mock.calls.length).toBe(1);
        });

    });
});
