import React from 'react';
import {mount} from 'enzyme';
import LabeledButton from 'button/LabeledButton';

describe('LabeledButton', () => {
    test('without children or buttonText', () => {
        const labeledbutton = mount(
            <LabeledButton btnLabel='Test Label' >
                children
            </LabeledButton>
        );
        expect(labeledbutton).toMatchSnapshot();
    });
});
