import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';

export default (TextField) => {
    return class inputMaskWrapper extends Component {
        static propTypes = {
            mask: PropTypes.string.isRequired,
            value: PropTypes.string,
            onChange: PropTypes.func,
            onFocus: PropTypes.func,
            onKeyDown: PropTypes.func,
            onPaste: PropTypes.func,
            customRules: PropTypes.object,
            placeholder: PropTypes.string
        };

        constructor(props) {
            super(props);
            this.dataBeforeChange = null;
            this.dataAfterChange = null;
        }

        getMaskRule = () => {
            return {
                '0': {
                    regExp: '\\d',
                    guideChar: '0'
                },
                // for "Activation Code" char
                'X': {
                    regExp: '[a-zA-Z0-9]',
                    guideChar: ' '
                },
                ...this.props.customRules
            };
        }

        getTextRules = () => {
            const maskRules = this.getMaskRule();
            const mask = this.props.mask;
            return _.map(mask, (char) => (maskRules[char] ? maskRules[char] : {
                isTemplate: true,
                guideChar: char
            }));
        }

        getUpdatedData = (preData, nextData) => {
            const {
                value: preValue,
                selectionStart: preSelectionStart,
                isPaste
            } = preData;
            const {
                value: nextValue,
                selectionStart: nextSelectionStart
            } = nextData;

            const textRules = this.getTextRules();

            if (isPaste) {
                // For paste
                const validText = this.addMask(nextValue, textRules);
                return {
                    maskText: _.merge(
                        this.createGuideMask(),
                        validText
                    ).join(''),
                    cusorPos: validText.length
                };
            } else {
                const guideMask = this.createGuideMask();
                const preMaskText = preValue === '' ? guideMask : preValue;
                const {
                    updateStartIdx,
                    updateEndIdx
                } = this.findUpdateRange(preMaskText, textRules, preSelectionStart, nextSelectionStart);

                // Update mask text
                const baseMaskText =  _.map(preMaskText, (char, idx) => {
                    return (idx >= updateStartIdx && idx <= updateEndIdx) ? guideMask[idx] : char;
                });
                const updateRangeMask = _.slice(textRules, updateStartIdx, updateEndIdx + 1);
                const textToBeUpdate = nextValue.substr(updateStartIdx, updateEndIdx - updateStartIdx + 1);
                const updateText = this.addMask(textToBeUpdate, updateRangeMask);
                const maskText = _.concat(
                    _.slice(baseMaskText, 0, updateStartIdx),
                    updateText,
                    _.slice(baseMaskText, updateStartIdx + updateText.length)
                ).join('');

                // Caculate cursor position
                let cusorPos = nextSelectionStart;
                if (nextSelectionStart > preSelectionStart) {
                    if (!updateText.length || preValue === maskText) {
                        cusorPos = preSelectionStart;
                    } else {
                        const maskLength = this.props.mask.length;
                        const nextEditIdx = _.findIndex(
                            maskText,
                            (char, idx) => (!textRules[idx].isTemplate),
                            updateStartIdx + 1
                        );
                        cusorPos = nextEditIdx !== -1 ? nextEditIdx : maskLength;
                    }
                }

                return {
                    maskText: _.concat(
                        _.slice(baseMaskText, 0, updateStartIdx),
                        updateText,
                        _.slice(baseMaskText, updateStartIdx + updateText.length)
                    ).join(''),
                    cusorPos
                };
            }
        }

        findUpdateRange(preMaskText, textRules, preCursorPos, nextCursorPos) {
            const lastIdx = textRules.length - 1;
            if (preCursorPos >= nextCursorPos) {
                // Delete text
                return {
                    updateStartIdx: nextCursorPos,
                    updateEndIdx: lastIdx
                };
            } else {
                // Add text
                const nearbyInvalidIdx = _.findIndex(textRules, (charRule, idx) => {
                    if (charRule.isTemplate || idx < preCursorPos) {
                        return false;
                    } else {
                        const charRegExp = new RegExp(charRule.regExp);
                        return !charRegExp.test(preMaskText[idx]);
                    }
                });
                if (nearbyInvalidIdx === -1) {
                    // Text complete, no need to update
                    return {
                        updateStartIdx: null,
                        updateEndIdx: null
                    };
                } else {
                    const blockIdx = _.findIndex(textRules, (charRule, idx) => {
                        if (charRule.isTemplate || idx < nearbyInvalidIdx) {
                            return false;
                        } else {
                            const charRegExp = new RegExp(charRule.regExp);
                            return charRegExp.test(preMaskText[idx]);
                        }
                    });
                    return {
                        updateStartIdx: preCursorPos,
                        updateEndIdx: blockIdx === -1 ? lastIdx : blockIdx - 1
                    };
                }
            }
        }

        addMask(text, textRules) {
            let textArr = _.toArray(text);
            let maskText = [];
            _.forEach(textRules, (charRule, idx) => {
                if (charRule.isTemplate) {
                    maskText.push(charRule.guideChar);
                } else {
                    const charRegExp = new RegExp(charRule.regExp);
                    const validCharIdx = _.findIndex(textArr, (eachChar) => charRegExp.test(eachChar));
                    if (validCharIdx !== -1) {
                        maskText.push(textArr[validCharIdx]);
                        _.pullAt(textArr, _.range(0, validCharIdx + 1));
                    } else {
                        return false;
                    }
                }

                const nextChar = textRules[idx + 1];
                return !!textArr.length || !!(nextChar && nextChar.isTemplate);
            });

            return maskText;
        }

        isComplete(maskText) {
            const textRules = this.getTextRules();
            return maskText !== '' && !_.findLast(textRules, (charRule, idx) => {
                if (charRule.isTemplate) {
                    return false;
                } else {
                    const charRegExp = new RegExp(charRule.regExp);
                    return !charRegExp.test(maskText[idx]);
                }
            });
        }

        isEmpty(maskText) {
            const textRules = this.getTextRules();
            return !_.find(textRules, (charRule, idx) => {
                if (charRule.isTemplate) {
                    return false;
                } else {
                    const charRegExp = new RegExp(charRule.regExp);
                    return charRegExp.test(maskText[idx]);
                }
            });
        }

        createGuideMask() {
            return _.map(this.getTextRules(), (charRule) => charRule.guideChar);
        }

        setCursorPos = (inputEl, cursorPos) => {
            inputEl.selectionStart = cursorPos;
            inputEl.selectionEnd = cursorPos;
        }

        getEventData = (e) => {
            const {
                target: inputEl,
                isPaste,
                isKeyDown
            } = e;
            const {
                selectionStart
            } = inputEl;

            return {
                value: inputEl.value,
                selectionStart,
                isPaste: isPaste === true,
                isKeyDown: isKeyDown === true
            };
        }

        _onPaste = (e) => {
            this.dataBeforeChange = this.getEventData({
                ...e,
                isPaste: true
            });
            this.props.onPaste && this.props.onPaste(e);
        }

        _onKeyDown = (e) => {
            this.dataBeforeChange = this.getEventData(e);
            this.props.onKeyDown && this.props.onKeyDown(e);
        }

        _onChange = (e) => {
            this.dataAfterChange = this.getEventData(e);
            const {
                cusorPos,
                maskText
            } = this.getUpdatedData(this.dataBeforeChange, this.dataAfterChange);

            const isUncontrolled = _.isUndefined(this.props.value);
            if (isUncontrolled) {
                e.target.value = maskText;
                this.setCursorPos(e.target, cusorPos);
            }

            this.props.onChange && this.props.onChange(e, {
                cusorPos,
                maskText,
                setCursorPos: this.setCursorPos,
                isComplete: this.isComplete(maskText),
                isEmpty: this.isEmpty(maskText)
            });
        }

        _onFocus = (e) => {
            this.props.onFocus && this.props.onFocus(e);
            // Caculate cursor position
            const textRules = this.getTextRules();
            const currValue = e.target.value;
            const lastValidIdx = _.findLastIndex(textRules, (charRule, idx) => {
                if (charRule.isTemplate || !currValue[idx]) {
                    return false;
                } else {
                    const charRegExp = new RegExp(charRule.regExp);
                    return charRegExp.test(currValue[idx]);
                }
            });
            const editIdx = lastValidIdx === -1 ? 0 : _.findIndex(
                textRules,
                (charRule) => !charRule.isTemplate,
                lastValidIdx + 1
            );
            const cusorPos = editIdx === -1 ? lastValidIdx : editIdx;
            // Set cursor position
            const inputEl = e.target;
            setTimeout(() => this.setCursorPos(inputEl, cusorPos));
        }

        render() {
            const {
                placeholder,
                onChange,
                onFocus,
                onKeyDown,
                onPaste,
                ...restProps
            } = this.props;

            return (
                <TextField
                    {...restProps}
                    placeholder={placeholder || this.createGuideMask().join('')}
                    onChange={this._onChange}
                    onFocus={this._onFocus}
                    onKeyDown={this._onKeyDown}
                    onPaste={this._onPaste}
                />
            );
        }
    }
};

