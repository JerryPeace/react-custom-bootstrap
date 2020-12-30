import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import {Basic} from '../Basic';
import ClearableTextField from './ClearableTextField';
import InputGroup from '../InputGroup';
import Button from '../../button/Button';

class SearchBox extends Basic {
    static propTypes = {
        displaySearchBtn: PropTypes.bool,
        textFieldProps: PropTypes.object,
        searchBtnProps: PropTypes.object,
        onSearch: PropTypes.func,

        // icon
        showLeftIcon: PropTypes.bool,
        leftIconName: PropTypes.string
    };

    static defaultProps = {
        displaySearchBtn: false,
        textFieldProps: {},
        searchBtnProps: {},
        onSearch: (searchText) => {}
    };

    constructor(props) {
        super(props);
        this.renderClearableTextField = ::this.renderClearableTextField;
        this.renderSearchBtn = ::this.renderSearchBtn;
        this._onSearch = ::this._onSearch;
    }

    componentDidMount() {
        this.originalVal = this._textField.originalVal;
        this.getValue = ::this._textField.getValue;
        this.isValid = ::this._textField.isValid;
    }

    _onSearch(e) {
        const searchText = this._textField.getValue();
        this.props.onSearch(searchText)
    }

    getInputElement() {
        return this._textField.getInputElement();
    }

    renderClearableTextField() {
        const {
            textFieldProps,
            disabled,
            showLeftIcon,
            leftIconName
        } = this.props;

        return (
            <ClearableTextField
                ref={(el) => this._textField = el}
                disabled={disabled}
                onClear={this._onSearch}
                onKeyUp={(e) => {
                    e.keyCode === 13 && this._onSearch(e);
                }}
                showLeftIcon={showLeftIcon}
                leftIconName={leftIconName}
                {...textFieldProps} />
        );
    }

    renderSearchBtn() {
        if (this.props.displaySearchBtn) {
            const {
                searchBtnProps,
                onSearch,
                disabled
            } = this.props;
            return (
                <Button
                    className={'serach-box-btn'}
                    isIconOnly={true}
                    disabled={disabled}
                    faStyle={'search'}
                    onClick={this._onSearch}
                    {...searchBtnProps} />
            );
        } else {
            return null;
        }
    }

    render() {
        const {
            className,
            displaySearchBtn
        } = this.props;
        return (
            <InputGroup
                className={classNames({
                    'search-box': true,
                    'has-search-btn': displaySearchBtn
                }, className)}
                inputFieldRenderer={this.renderClearableTextField}
                rightFieldType={'button-group'}
                rightField={this.renderSearchBtn()} />
        );
    }
}

export default SearchBox;
