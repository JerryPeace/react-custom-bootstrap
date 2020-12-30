import React from 'react';
import {mount} from 'enzyme';
import IconButton from 'button/IconButton';

describe('IconButton', () => {
    let button;

    test('glyphicon', () => {
        button = mount(<IconButton glyphiconType='pen'/>);
        expect(button).toMatchSnapshot();
    });

    test('with text', () => {
        button = mount(<IconButton glyphiconType='pen'>children</IconButton>);
        expect(button).toMatchSnapshot();
    });

    test('image icon', () => {
        button = mount(<IconButton imgIconSrc='./fake.jpg'/>);
        expect(button).toMatchSnapshot();
    });

    test('empty', () => {
        button = mount(<IconButton/>);
        expect(button).toMatchSnapshot();
    });
});
