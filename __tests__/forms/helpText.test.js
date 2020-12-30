import React from 'react';
import { mount } from 'enzyme';
import HelpText from 'forms/HelpText';
import toJSON from'enzyme-to-json';

describe('HelpText', () => {

    let helpText;

    describe('HelpText', () => {

        beforeEach(() => {
            helpText = mount(<HelpText />);
        });

        test('should render corrently', () => {
            expect(toJSON(helpText)).toMatchSnapshot();
        });

    });

});
