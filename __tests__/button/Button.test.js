import React from 'react';
import {mount} from 'enzyme';
import Button from 'button/Button';

describe('Button', () => {
    let button;

    test('without children or buttonText', () => {
        button = mount(
            <Button></Button>
        );
        expect(button).toMatchSnapshot();
    });

    test('with button label', () => {
        button = mount(
            <Button btnLabel='Test Label' >
                children
            </Button>
        );
        expect(button).toMatchSnapshot();
    });

    test('with customize icon in <a> wrapper', () => {
        button = mount(
            <Button
                buttonText='Click'
                iconEl='<span>icon</span>'
                target='_blank'
            >
                children
            </Button>
        );
        expect(button).toMatchSnapshot();
    });

    test('with loading status in <div> wrapper', () => {
        button = mount(
            <Button
                componentClass='div'
                buttonText='Click'
                isLoading
            >
            </Button>
        );
        expect(button).toMatchSnapshot();
    });

    test('with fa icon and caret style in <a> wrapper', () => {
        button = mount(
            <Button
                buttonText='Click'
                href='test.com'
                faStyle='plus'
                isCaretStyle
            >
            </Button>
        );
        expect(button).toMatchSnapshot();
    });
});
