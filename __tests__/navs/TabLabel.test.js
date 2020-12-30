import { tabLabelSource, tabLabelTarget } from 'navs/TabLabel';
import { options } from 'react-dom';

jest.mock('react-dom');

describe('TabLabel', () => {

    test('tabLabelSource bridges props.index to monitor', () => {
        const mockProps = {
            onDragStart: jest.fn(),
            index: 999,
            item: { dummy: 'dummy' }
        };
        const ret = tabLabelSource.beginDrag(mockProps);

        expect(mockProps.onDragStart.mock.calls.length).toBe(1);
        expect(ret.index).toBe(999);
        expect(ret.item).toEqual({ dummy: 'dummy' });
    });

    test('tabLabelTarget.drop dispatches event', () => {
        const mockProps = {
            onDrop: jest.fn()
        };
        tabLabelTarget.drop(mockProps);
        expect(mockProps.onDrop.mock.calls.length).toBe(1);
    });

    test('tabLabelTarget hover', () => {
        let mousePosition = 80;
        const mockProp = {
            index: 1,
            reorderTab: jest.fn()
        };
        const mockMonitor = {
            getItem: () => ({ index: 999 }),
            getClientOffset: () => ({ x: mousePosition })
        };

        options.implementation = {
            getBoundingClientRect: () => ({
                left: 10,
                right: 100
            })
        };

        tabLabelTarget.hover(mockProp, mockMonitor, {});
        expect(mockProp.reorderTab.mock.calls.length).toBe(0);

        mousePosition = 20;
        tabLabelTarget.hover(mockProp, mockMonitor, {});
        expect(mockProp.reorderTab.mock.calls.length).toBe(1);
    });
});
