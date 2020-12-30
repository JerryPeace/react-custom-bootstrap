import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
//import './labeled-layout.less';
import LabeledRow from './LabeledRow';
import LabeledGroup from './LabeledGroup';

class LabeledLayout extends Component {

    static propTypes = {
        fixedWidth: PropTypes.bool,
        items: PropTypes.array,
        noHoverEffect: PropTypes.bool,
        onLayoutFixed: PropTypes.func
    };

    static defaultProps = {
        noHoverEffect: false
    };

    constructor(props) {
        super(props);
        this.bindTable = ::this.bindTable;

        this.state = {
            tableWidth: null,
            valueWidth: null
        };
    }

    componentDidMount() {
        this.props.fixedWidth && this.fixLayoutSize();
    }

    componentDidUpdate() {
        this.props.fixedWidth && this.fixLayoutSize();
    }

    fixLayoutSize() {
        const { onLayoutFixed } = this.props;
        if (this.table && !this.state.tableWidth) {
            const tableWidth = this.table.clientWidth;
            const valueWidth = this.table.querySelector('.labeled-layout-value').clientWidth;
            setTimeout(() => {
                this.setState({ tableWidth, valueWidth }, onLayoutFixed);
            });
        }
    }

    bindTable(ref) {
        this.table = ref;
    }

    renderRows() {
        const { tableWidth, valueWidth } = this.state;
        let labelStyles;
        let valueStyles;
        if (tableWidth) {
            labelStyles = { width: tableWidth - valueWidth };
            valueStyles = { width: valueWidth };
        }
        return (!_.isEmpty(this.props.items) &&
            <LabeledGroup
                labelStyles={labelStyles}
                valueStyles={valueStyles}
                layoutFixed={!!tableWidth && this.props.fixedWidth}
            >
                {_.map(this.props.items, (item, index) => (
                    <LabeledRow
                        className={item.className}
                        key={item.key || index}
                        label={item.label}
                        type={item.type}
                        value={item.value} />
                ))}
            </LabeledGroup>
        );
    }

    renderChildren() {
        const { tableWidth, valueWidth } = this.state;
        if (tableWidth) {
            const labelStyles = { width: tableWidth - valueWidth };
            const valueStyles = { width: valueWidth };
            return React.Children.map(this.props.children, (node) => {
                return React.cloneElement(node, {
                    labelStyles,
                    valueStyles,
                    layoutFixed: !!tableWidth && this.props.fixedWidth
                });
            });
        } else {
            return this.props.children;
        }
    }

    render() {
        const {
            children,
            className,
            noHoverEffect
        } = this.props;
        const clsNames = classNames('labeled-layout', className, {
            'no-hover-effect': noHoverEffect
        });

        let styles;
        if (this.state.tableWidth) {
            styles = {
                width: this.state.tableWidth,
                tableLayout: 'fixed'
            };
        }

        return (
            <table ref={this.bindTable} style={styles} className={clsNames}>
                {this.renderRows()}
                {this.renderChildren()}
            </table>
        );
    }
}

export default LabeledLayout;
