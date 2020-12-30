import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Menu from '../menu/Menu';
import SearchBox from '../forms/searchBox';

const searchMenuHoc = (WrappedComponent) => (class extends Component {
    static propTypes = {
        clearFilterTextOnClose: PropTypes.bool,
        listPullRight: PropTypes.bool,
        searchBoxPlaceholder: PropTypes.string,
        searchBoxPorps: PropTypes.object,
        onRootClose: PropTypes.func,
        isLoading: PropTypes.bool,
        isMenuOpen: PropTypes.bool,
        onSearchChange: PropTypes.func,
        onSearchClear: PropTypes.func
    };

    static defaultProps = {
        clearFilterTextOnClose: true,
        listPullRight: false
    };

    constructor(props) {
        super(props);

        this.handleSearchChange = ::this.handleSearchChange;
        this.handleSearchClear = ::this.handleSearchClear;
    }

    componentDidUpdate(prevProps) {
        const {
            isLoading,
            isMenuOpen,
            clearFilterTextOnClose
        } = this.props;
        // Focus on search input when
        // 1. Dropdown menu opened(use for no loading)
        // 2. Loading finished
        if ((isMenuOpen && !prevProps.isMenuOpen)
                || (!isLoading && prevProps.isLoading)) {
            this.getInputElement().focus();
        }

        if (clearFilterTextOnClose && !isMenuOpen) {
            this.getInputElement().value = '';
        }
    }

    handleSearchChange(event) {
        const { onSearchChange } = this.props;
        onSearchChange && onSearchChange(event.target.value);
    }

    handleSearchClear() {
        const { onSearchClear } = this.props;
        this.getInputElement().focus();
        onSearchClear && onSearchClear();
    }

    getInputElement() {
        return this.searchBoxElement.getInputElement();
    }

    render() {
        const {
            className,
            children,
            isLoading,
            listPullRight,
            searchBoxPorps,
            searchBoxPlaceholder,
            ...wrappedComponentProps
        } = this.props;
        const searchMenuClass = classNames({
            'dropdown-menu-has-header': true,
            'pull-right': listPullRight
        }, className);

        return (
            <WrappedComponent
                className={searchMenuClass}
                {...wrappedComponentProps}
            >
                <SearchBox
                    ref={(element) => this.searchBoxElement = element}
                    displaySearchBtn={false}
                    disabled={isLoading}
                    showLeftIcon={true}
                    textFieldProps={{
                        placeholder: searchBoxPlaceholder,
                        onChange: this.handleSearchChange,
                        onClear: this.handleSearchClear
                    }}
                    {...searchBoxPorps} />
                {children}
            </WrappedComponent>
        );
    }
});

export default searchMenuHoc;
