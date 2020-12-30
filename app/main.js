import React from 'react';
import ReactDOM from 'react-dom';
import {FileUpload, TextField, Label, Loader, Alert, Badge, Breadcrumb, BreadcrumbItem, Button, Collapse, CollapseGroup, FormPanel, HoverTrigger, Panel, ProductLogo, Checkbox, Radio, Select, CheckboxGroup, RadioGroup, FormGroup, FormControls, Glyphicon, IconButton, InputGroup, LabelField, Tabbable, TabPanel, Table, TmAgGrid, DateTimeRangePicker, DateTimePicker, Mask, Modal, HelpText, Dropdown, ConvenientDropdown, Menu, MenuItem, Fieldset, QueryBuilder, ColorLabel, TmTooltip, TooltipHelper, Navbar, SearchBox, CollapsiblePanel, MultipleSelection, Portal, LabeledButton, MediaObject, ConfirmModalDialog, inputMaskWrapper, TreeDropdown, CheckboxTree, ClearableTextField, TmIcon } from './../src';
import classNames from 'classnames';
import LayoutHelper from '../src/forms/LayoutHelper';
import IndeterminateCheckbox from '../src/tmAgGrid/IndeterminateCheckbox';
import moment from 'moment';
import _ from 'lodash';

import SmartFilterQueryBuilderSample from './example/queryBuilder/SmartFilterQueryBuilderSample';

const ACKey = inputMaskWrapper(TextField);

class App extends React.Component {
    constructor(props) {
        super(props);
        Table.deprecatedWarning();
    }
    state = {
        activeTab: 21,
        ckboxgrp11: false,
        ckboxgrp12: true,
        ckboxgrp13: false,
        nameValue1: '',
        nameValue: '',
        radioGroup: 'opt2',
        radioSelected2: 'singleradio1',
        singleCheckbox: true,
        showTip: false,
        hoverTriggerWidth: '',
        hoverTriggerHeight: '',
        hoverTriggerLeft: '',
        hoverTriggerTop: '',
        localTable: {
            selected: {
                2: {
                    id: 2,
                    index: 2,
                    name: 'Bradley Keeling',
                    email: 'Gaylord.Langworth92@hotmail.com'
                }
            },
            columns: [
                {
                    name: 'index',
                    sortBy: (index, data, props) => {
                        return index;
                    }
                },
                {
                    name: 'name',
                    title: 'Name(unsortable)',
                    sortable: false
                },
                { name: 'email' }
            ],
            dataSource: [{
                id: 1,
                index: 1,
                name: 'Jean Ebert',
                email: 'Tate59@yahoo.com'
            }, {
                id: 2,
                index: 2,
                name: 'Bradley Keeling',
                email: 'Gaylord.Langworth92@hotmail.com'
            }, {
                id: 3,
                index: 3,
                name: 'Frozen Cheese',
                email: 'Athena_Lehner@hotmail.com'
            }, {
                id: 4,
                index: 4,
                name: 'Krystina VonRueden Jr.',
                email: 'Scotty73@hotmail.com'
            }, {
                id: 5,
                index: 5,
                name: 'Summer Goyette',
                email: 'Juana.West90@hotmail.com'
            }]
        },
        remoteTable: {
            page: 1,
            pageSize: 5,
            columns: [
                {
                    name: 'index',
                    title: '#',
                    width: 48,
                    type: 'number',
                    sortable: false
                },
                { name: 'name'},
                { name: 'city'},
                { name: 'country'},
                { name: 'email'}
            ]
        },
        remoteTable2: {
            page: 1,
            pageSize: 5,
            paginationToolbarProps: {
                pageSizes: [
                    5,
                    10,
                    15
                ]
            },
            columns: [
                {
                    name: 'index',
                    title: '#',
                    width: 48,
                    type: 'number',
                    sortable: true
                },
                { name: 'productName' },
                { name: 'city' },
                { name: 'price' }
            ],
            sortInfo: [
                {name: 'index', dir: 'asc'}
            ]
        },
        dropdown: {
            isMenuOpen: false,
            isSubMenuOpen: false,
            selectData: {
                text: 'Any time',
                value: 1
            }
        },
        dtDropdown: {
            isMenuOpen: false,
            isSideMenuOpen: false,
            selectData: {
                text: 'Any time',
                value: 1
            }
        },
        queryBuilder: {
            rootRules: {
                condition: 'and',
                rules: [
                    {
                        field: 0,
                        operator: true,
                        value: 0
                    },
                    {
                        field: 1,
                        operator: false,
                        value: 'test'
                    }
                ]
            }
        },
        tabItems: [
            {text: 'Checkbox Group', href: '#tab1', value: 0, noDnD: true},
            {text: 'Form Field', href: '#tab2', value: 1},
            {text: 'Table', href: '#tab3', value: 2,
                subMenu: [
                    {text: 'Rename 1', value: 'rename'},
                    {text: 'Delete', value: 'delete'}
                ]
            },
            {text: 'Tooltip', href: '#tab4', value: 3},
            {text: 'Buttons', href: '#tab5', value: 4},
            {text: 'IconButtons', href: '#tab6', value: 5},
            {text: 'InputGroup', href: '#tab7', value: 6},
            {text: 'Dropdown', href: '#tab8', value: 7},
            {text: 'Collapse', href: '#tab9', value: 8},
            {text: 'Modal', href: '#tab10', value: 9},
            {text: 'Panel', href: '#tab11', value: 10},
            {text: 'FileUpload', href: '#tab12', value: 11},
            {text: 'Loader', href: '#tab13', value: 12},
            {text: 'DirtyCheck', href: '#tab13', value: 13},
            {text: 'DateTimePicker', href: '#tab14', value: 14,
                subMenu: [
                    {text: 'Rename 2', value: 'rename'},
                    {text: 'Delete', value: 'delete'}
                ]
            },
            {text: 'DateTimeRangePicker', href: '#tab15', value: 15},
            {text: 'Dropdown with DateTimePicker', href: '#tab16', value: 16},
            {text: 'Mask', href: '#tab17', value: 17},
            {text: 'Fieldset', href: '#tab18', value: 18},
            {text: 'QueryBuilder', href: '#tab19', value: 19, noDnD: true},
            {text: 'QueryBuilder (SmartFilter)', href: '#tab20', value: 20, noDnD: true},
            {text: 'TmAgGrid', href: '#tab21', value: 21},
            {text: 'MultipleSelection', href: '#tab22', value: 22},
            {text: 'Portal', href: '#tab23', value: 23},
            {text: 'SearchBox', href: '#tab24', value: 24},
            {text: 'TreeDropdown', href: '#tab25', value: 25}
        ],
        selectedValuesBasic: ['c', 'e'],
        selectedValuesBasicWithDisabled: ['c', 'e'],
        selectedValuesGroup: ['c', 'e'],
        selectedValuesGroupWithDisabled: ['c', 'e'],
        fileName: 'filename.test',
        fileSize: 12345,

        // #tab22: Portal
        showPortalModal: false,

        // #tab24: TreeDropdown
        checked: ['C', 'E', 'F'],
        expanded: [],

        dtrp2From: moment(),
        dtrp2To: moment().add(6, 'd')
    };

    onRuleRemove = (removedIdx) => {
        let tmpRules = _.cloneDeep(this.state.queryBuilder.rootRules);
        tmpRules.rules.splice(removedIdx, 1);
        this.setState({queryBuilder: {
            rootRules: tmpRules
        }});
    }

    _queryChange(value, idx, cb) {
        let tmpRules = _.cloneDeep(this.state.queryBuilder.rootRules);

        let targetRule = tmpRules.rules[idx];

        this.setState({queryBuilder: {
            rootRules: tmpRules
        }});

        return cb(targetRule, value);
    }

    onQueryFieldChange = (value, idx) => {
        this._queryChange(value, idx, (targetRule, value) => {
            targetRule.field = value;
            targetRule.operator = '';
            targetRule.value = '';
        });
    }

    onQueryOperatorChange = (value, idx) => {
        this._queryChange(value, idx, (targetRule, value) => {
            targetRule.operator = value;
        });
    }

    onQueryValueChange = (value, idx) => {
        this._queryChange(value, idx, (targetRule, value) => {
            targetRule.value = value;
        });
    }

    onAddNewRuleClick = (insertAfterIdx) => {
        let tmpRules = _.cloneDeep(this.state.queryBuilder.rootRules);
        tmpRules.rules.splice(
            insertAfterIdx + 1,
            0,
            {
                field: '0',
                operator: '1',
                value: '1'
            }
        );

        this.setState({queryBuilder: {
            rootRules: tmpRules
        }});
    }

    handleSelectChange = () => {
        console.log(this.refs.select1.getValue());
    }

    handleNameChange = (component, newVal, oldVal, e) => {
        this.setState({
            nameValue: e.target.value
        });
    }

    handleNameChange1 = (component, newVal, oldVal, e) => {
        this.setState({
            nameValue1: e.target.value
        });
    }

    handleRadioChange = (e) => {
        this.setState({[e.currentTarget.name]: e.currentTarget.value});
        console.log(this.refs.rg.getValue());
    }

    handleNavTabsClick = (value, e) => {
        this.setState({activeTab: value});
    }

    handleCheckboxChange = (e) => {
        this.setState({[e.currentTarget.value]: !this.state[e.currentTarget.value]});
        console.log(this.refs.cbg.getValue());
    }

    handleMouseEnter(e) {
        this.setState({
            showTip: !this.state.showTip,
            hoverTriggerWidth: e.currentTarget.offsetWidth,
            hoverTriggerHeight: e.currentTarget.offsetHeight,
            hoverTriggerTop: e.currentTarget.offsetTop,
            hoverTriggerLeft: e.currentTarget.offsetLeft
        });
    }

    handleMouseLeave(e) {
        this.setState({
            showTip: !this.state.showTip,
            hoverTriggerWidth: '',
            hoverTriggerHeight: '',
            hoverTriggerTop: '',
            hoverTriggerLeft: ''
        });
    }

    preventDefault(e) {
        e.preventDefault();
    };

    getDropdownDemo() {
        const {dropdown} = this.state;
        const {isMenuOpen, isSubMenuOpen, selectData} = dropdown;
        const actions = {
            onToggleClick() {
                this.setState({
                    dropdown: {
                        ...dropdown,
                        isMenuOpen: !isMenuOpen
                    }
                });
            },
            onGetDateTimeClick() {
                const isValid = this.dtNode.isValid();
                const value = this.dtNode.getValue();
                console.info('SelectedDate: ', value);
                console.info('isValid: ', isValid);
                if (isValid) {
                    this.setState({
                        dropdown: {
                            ...dropdown,
                            isMenuOpen: false,
                            isSubMenuOpen: false,
                            selectData: {
                                ...selectData,
                                value
                            }
                        }
                    });
                }
            },
            onMenuRootClose() {
                this.setState({
                    dropdown: {
                        ...dropdown,
                        isMenuOpen: false
                    }
                });
            },
            onMenuItemSelect({selectData, itemContent, event}) {
                if (selectData.key === 7) {
                    this.setState({
                        dropdown: {
                            ...dropdown,
                            selectData,
                            isSubMenuOpen: true
                        }
                    });
                } else {
                    this.setState({
                        dropdown: {
                            ...dropdown,
                            selectData,
                            isMenuOpen: false,
                            isSubMenuOpen: false
                        }
                    });
                }
            }
        };
        const ui = {
            items: [
                {text: 'Any time', key: 1, value: 1},
                {text: 'Last 24 hours', key: 2, value: 2},
                {text: 'Last 7 days', key: 3, value: 3},
                {text: 'Last 14 days', key: 4, value: 4},
                {text: 'Last 30 days', key: 5, value: 5},
                {text: 'Last 60 days', key: 6, value: 6},
                {text: 'Custom period', key: 7, value: 7, subMenu: true}
            ],
            getToggle() {
                return (
                    <IconButton
                        onClick={actions.onToggleClick.bind(this)}
                        bsStyle={'plain'}
                        isDropdown
                        isCaretStyle
                    >
                        {selectData.text}
                    </IconButton>
                );
            },
            getMenu() {
                return (
                    <Menu
                        onRootClose={actions.onMenuRootClose.bind(this)}
                        onItemSelect={actions.onMenuItemSelect.bind(this)}
                        isMenuAlignRight
                        isMenuCheckStyle
                    >
                        {ui.items.map((item, index) => {
                            return (
                                <MenuItem
                                    key={item.key}
                                    selectData={item}
                                    active={selectData.value === item.value}
                                    subMenu={item.subMenu ? ui.getSubMenu.call(this) : null}
                                >
                                    {item.text}
                                </MenuItem>
                            );
                        })}
                        <MenuItem divider />
                        <MenuItem header>MenuItem header</MenuItem>
                        <MenuItem disabled>MenuItem disabled</MenuItem>
                    </Menu>
                );
            },
            getSubMenu() {
                return (
                    <Menu
                        isMenuOpen={isMenuOpen && isSubMenuOpen}
                        isSubMenuOpenLeft
                    >
                        <div style={{margin: 12}}>
                            <DateTimeRangePicker
                                ref={node => this.dtNode = node}
                                fromTime={moment()}
                                toTime={moment().add(6, 'days')}
                            />
                            <Button onClick={actions.onGetDateTimeClick.bind(this)}>
                                Get Value
                            </Button>
                        </div>
                    </Menu>
                );
            }
        };

        return (
            <div style={{margin: '0 0 500px 800px'}}>
                <Dropdown
                    isMenuOpen={isMenuOpen}
                    toggle={ui.getToggle.call(this)}
                    menu={ui.getMenu.call(this)}
                />
            </div>
        );
    }

    getDropdownDateTimePickerDemo() {
        const {dtDropdown} = this.state;
        const {isMenuOpen, isSideMenuOpen, selectData} = dtDropdown;
        const actions = {
            onToggleClick() {
                this.setState({
                    dtDropdown: {
                        ...dtDropdown,
                        isMenuOpen: !isMenuOpen
                    }
                });
            },
            onGetDateTimeClick() {
                const isValid = this.dtNode.isValid();
                const value = this.dtNode.getValue();
                console.info('SelectedDate: ', value);
                console.info('isValid: ', isValid);
                if (isValid) {
                    this.setState({
                        dtDropdown: {
                            ...dtDropdown,
                            isMenuOpen: false,
                            isSideMenuOpen: false,
                            selectData: {
                                ...selectData,
                                value
                            }
                        }
                    });
                }
            },
            onMenuRootClose() {
                this.setState({
                    dtDropdown: {
                        ...dtDropdown,
                        isMenuOpen: false
                    }
                });
            },
            onMenuItemSelect({selectData, itemContent, event}) {
                if (selectData.key === 7) {
                    this.setState({
                        dtDropdown: {
                            ...dtDropdown,
                            selectData,
                            isSideMenuOpen: true
                        }
                    });
                } else {
                    this.setState({
                        dtDropdown: {
                            ...dtDropdown,
                            selectData,
                            isMenuOpen: false,
                            isSideMenuOpen: false
                        }
                    });
                }
            }
        };
        const ui = {
            items: [
                {text: 'Any time', key: 1, value: 1},
                {text: 'Last 24 hours', key: 2, value: 2},
                {text: 'Last 7 days', key: 3, value: 3},
                {text: 'Last 14 days', key: 4, value: 4},
                {text: 'Last 30 days', key: 5, value: 5},
                {text: 'Last 60 days', key: 6, value: 6},
                {text: 'Custom period', key: 7, value: 7}
            ],
            getToggle() {
                return (
                    <IconButton
                        onClick={actions.onToggleClick.bind(this)}
                        bsStyle={'plain'}
                        isDropdown
                        isCaretStyle
                    >
                        {selectData.text}
                    </IconButton>
                );
            },
            getMenu() {
                return (
                    <Menu
                        onRootClose={actions.onMenuRootClose.bind(this)}
                        onItemSelect={actions.onMenuItemSelect.bind(this)}
                        // isMenuCheckStyle
                    >
                        {ui.items.map((item, index) => {
                            return (
                                <MenuItem
                                    key={item.key}
                                    selectData={item}
                                    active={selectData.value === item.value}
                                >
                                    {item.text}
                                </MenuItem>
                            );
                        })}
                        <MenuItem divider />
                        <MenuItem header>MenuItem header</MenuItem>
                        <MenuItem disabled>MenuItem disabled</MenuItem>
                    </Menu>
                );
            },
            getSideMenu() {
                return (
                    <div>
                        <DateTimeRangePicker
                            ref={node => this.dtNode = node}
                            fromTime={moment()}
                            toTime={moment().add(6, 'days')}
                        />
                        <Button onClick={actions.onGetDateTimeClick.bind(this)}>
                            Get Value
                        </Button>
                    </div>
                );
            }
        };

        return (
            <div style={{margin: '0 0 500px 800px'}}>
                <Dropdown
                    isMenuOpen={isMenuOpen}
                    toggle={ui.getToggle.call(this)}
                    menu={ui.getMenu.call(this)}
                    sideMenu={ui.getSideMenu.call(this)}
                    isSideMenuOpen={isMenuOpen && isSideMenuOpen}
                    isSideMenuOpenLeft
                />
            </div>
        );
    }

    ajax(settings = {mehtod, url, data, success, error}) {
        const {mehtod, url, data, success, error} = settings;
        let reqUrl = url;
        let xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
        xhttp.onload = function() {
            xhttp.status === 200 ? success(xhttp.response) : error(xhttp);
        };
        if (data && mehtod === 'GET') {
            reqUrl += '?';
            for (let key in data) {
                reqUrl += (key + '=' + data[key] + '&');
            }
            xhttp.open(mehtod, reqUrl);
            xhttp.send();
        } else {
            xhttp.open(mehtod, reqUrl);
            xhttp.send(data);
        }
        return xhttp;
    };

    handleReorderTab = (targetIndex, toIndex) => {
        const items = [...this.state.tabItems];
        // move item out
        const item = items.splice(targetIndex, 1)[0];
        // put item back
        items.splice(toIndex, 0, item);
        this.setState({ tabItems: items });
    }

    renderTabContents(itemValue) {
        const divStyle = {
            marginLeft: '15px',
            marginRight: '15px',
            marginTop: '30px',
            marginBottom: '30px'
        };

        switch(itemValue) {
        case 0:
            return (
                <div key={itemValue}>
                    <form>
                        <CheckboxGroup
                            name={'mycheckboxgroup'}
                            items={[
                                {labelText: 'Checkbox group 1-1', value: 'ckboxgrp21', labelAlign: 'left'},
                                {labelText: 'Checkbox group 1-2', value: 'ckboxgrp22'},
                                {labelText: 'Checkbox group 1-3', value: 'ckboxgrp23'}
                            ]} />
                        <Button
                            bsStyle={'danger'}
                            block={false}
                            disabled={false}>
                            Test
                        </Button>
                    </form>
                </div>
            );
        case 1:
            return (
                <div key={itemValue}>
                    <FormPanel layout={'h'}>
                        <TextField
                            ref={'name1'}
                            bsSize={'xlarge'}
                            bsStyle={'error'}
                            helpText={'This is invalid text'}
                            labelText={'This is first TextField:'}
                            placeholder={'Type user name'}
                            onValueChange={this.handleNameChange1}
                            value={this.state.nameValue1} />
                        <TextField
                            ref={'name1'}
                            bsSize={'xlarge'}
                            labelText={'This is second TextField with right text'}
                            placeholder={'Type user name'}
                            onValueChange={this.handleNameChange1}
                            value={this.state.nameValue1} />
                        <Button
                            bsStyle={'danger'}
                            block={false}
                            disabled={false}>
                            Test
                        </Button>
                    </FormPanel>
                </div>
            );
        case 2:
            return (
                <div key={itemValue}>
                    <div style={{ color: 'red', fontSize: 25, margin: 30, width: 750 }}>
                        Warning: "Table" will be deprecated. Use "TmAgGrid" instead. [react-commercial-bootstrap]
                    </div>
                    {/*
                    <p>Empty data - <small>*columnResize *columnOrderChange *withColumnMenu</small></p>
                    <Table
                        emptyText={'No records'}
                        dataSource={[]}
                        columns={[
                            {
                                name: 'index',
                                title: '#',
                                width: 45,
                                type: 'number',
                                sortable: false
                            },
                            { name: 'name' },
                            { name: 'city' },
                            { name: 'country' },
                            { name: 'email' }
                        ]}
                        columnResize={true}
                        onColumnResize={(settings) => {
                            console.info(settings);
                        }}
                        columnOrderChange={true}
                        onColumnOrderChange={(settings)=> {
                            console.info(settings);
                        }}
                        withColumnMenu={true} />
                    <br /><br />

                    <p>Local data - <small>*checkbox *rowStyling *DisabledRow *multiSelect</small></p>
                    <Table
                        checkbox={true}
                        multiSelect={true}
                        columns={[
                            {
                                name: 'index',
                                render: (index) => {
                                    if (index % 2) {
                                        return index;
                                    } else {
                                        return (<span>{index}<span> (disable)</span></span>);
                                    }
                                }
                            },
                            {
                                name: 'name',
                            },
                            { name: 'email' }
                        ]}
                        rowStyle={(data, props) => {
                            let style = {};
                            if (data.index === 1) {
                                style.fontWeight = 'bold';
                            }
                            return style;
                        }}
                        defaultSelectedByIndex={[1]}
                        onSelectionChange={(selection, data) => {
                            // console.log(selection,data)
                        }}
                        useOriginalSelection={true}
                        dataSource={[{
                            id: 1,
                            index: 1,
                            name: 'Jean Ebert',
                            email: 'Tate59@yahoo.com'
                        }, {
                            id: 2,
                            disabled: true,
                            index: 2,
                            name: 'Bradley Keeling',
                            email: 'Gaylord.Langworth92@hotmail.com'
                        }, {
                            id: 3,
                            index: 3,
                            name: 'Frozen Cheese',
                            email: 'Athena_Lehner@hotmail.com'
                        }, {
                            id: 4,
                            disabled: true,
                            index: 4,
                            name: 'Krystina VonRueden Jr.',
                            email: 'Scotty73@hotmail.com'
                        }, {
                            id: 5,
                            index: 5,
                            name: 'Summer Goyette',
                            email: 'Juana.West90@hotmail.com'
                        }]} />
                    <br /><br />

                    <p>Local data2 - <small>*sortable *checkbox</small></p>
                    <Button
                        buttonText={'Get Selection'}
                        onClick={() => {
                            console.info(this.refs.localTable2.getValue());
                        }} />
                    <Table
                        ref={'localTable2'}
                        checkbox={true}
                        multiSelect={true}
                        sortable={true}
                        singleSort={true}
                        sortInfo={this.state.localTable.sortInfo || [{name: 'index', dir: 'asc'}]}
                        columns={this.state.localTable.columns}
                        dataSource={this.state.localTable.dataSource}
                        onSortChange={(info) => {
                            this.setState({
                                localTable: {
                                    ...this.state.localTable,
                                    sortInfo: info.sortInfo,
                                    dataSource: info.sortedData
                                }
                            });
                        }}
                        selected={this.state.localTable.selected}
                        onSelectionChange={(info) => {
                            console.info(info);
                            this.setState({
                                localTable: {
                                    ...this.state.localTable,
                                    selected: info.nextSelected
                                }
                            });
                        }}
                        onSelectAllChange={(info) => {
                            console.info(info);
                        }} />
                    <br /><br />

                    <p>Remote data 1 - Use URI as dataSource *paging *pageSize</p>
                    <Table
                        checkbox={true}
                        multiSelect={true}
                        dataSource={'http://10.1.117.219:3000/people'}
                        columns={this.state.remoteTable.columns}
                        QueryParams={{
                            _page: this.state.remoteTable.page,
                            _limit: this.state.remoteTable.pageSize
                        }}
                        page={this.state.remoteTable.page}
                        onPageChange={(page) => {
                            this.setState({
                                remoteTable: {
                                    ...this.state.remoteTable,
                                    page: page
                                }
                            });
                        }}
                        pageSize={this.state.remoteTable.pageSize}
                        onPageSizeChange={(pageSize) => {
                            this.setState({
                                remoteTable: {
                                    ...this.state.remoteTable,
                                    page: 1,
                                    pageSize: pageSize
                                }
                            });
                        }}
                        getDataSourceInfo={(res) => {
                            this.setState({
                                remoteTable: {
                                    ...this.state.remoteTable,
                                    dataSourceCount: (res.length) * 5
                                }
                            });
                        }}
                        dataSourceCount={this.state.remoteTable.dataSourceCount} />
                    <br /><br />

                    <p>
                        Remote data 2 - Use Function as dataSource *paging *pageSize *sort &nbsp;
                    </p>
                    <Button
                        faStyle={'refresh'}
                        buttonText={'Reload Data'}
                        onClick={() => {
                            this.refs.remoteTable2.reload();
                        }} />
                    <Table
                        ref={'remoteTable2'}
                        multiSelect={true}
                        checkbox={true}
                        sortable={true}
                        singleSort={true}
                        sortInfo={this.state.remoteTable2.sortInfo}
                        onSortChange={(sortInfo) => {
                            this.setState({
                                remoteTable2: {
                                    ...this.state.remoteTable2,
                                    sortInfo: sortInfo,
                                    page: 1,
                                    reload: true
                                }
                            });
                        }}
                        reload={this.state.remoteTable2.reload}
                        dataSource={() => {
                            // It can also use jQuery.ajax() instead of promise
                            const promise = new Promise((resolve, reject) => {
                                this.ajax({
                                    mehtod: 'GET',
                                    url: 'http://10.1.117.219:3000/products',
                                    data: {
                                        _page: this.state.remoteTable2.page,
                                        _limit: this.state.remoteTable2.pageSize,
                                        _sort: this.state.remoteTable2.sortInfo[0].name,
                                        _order: this.state.remoteTable2.sortInfo[0].dir.toUpperCase()
                                    },
                                    success: (response) => {
                                        resolve(response);
                                        this.setState({
                                            remoteTable2: {
                                                ...this.state.remoteTable2,
                                                reload: false
                                            }
                                        });
                                    },
                                    error: (xhttp) => {
                                        reject(Error(xhttp.statusText));
                                        this.setState({
                                            remoteTable2: {
                                                ...this.state.remoteTable2,
                                                reload: false
                                            }
                                        });
                                    }
                                });
                            });

                            // Need to return a Promise (or a thenable)
                            return promise.then(function success(response) {
                                return {
                                    data: response,
                                    count: 100  // total counts
                                }
                            }, function failed(statusText) {
                                console.info("Failed!", statusText);
                            });
                        }}
                        columns={this.state.remoteTable2.columns}
                        paginationToolbarProps={this.state.remoteTable2.paginationToolbarProps}
                        page={this.state.remoteTable2.page}
                        onPageChange={(page) => {
                            this.setState({
                                remoteTable2: {
                                    ...this.state.remoteTable2,
                                    page: page
                                }
                            });
                        }}
                        pageSize={this.state.remoteTable2.pageSize}
                        onPageSizeChange={(pageSize) => {
                            this.setState({
                                remoteTable2: {
                                    ...this.state.remoteTable2,
                                    page: 1,
                                    pageSize: pageSize
                                }
                            });
                        }} />
                    <br /><br />
                */}
                </div>);
        case 3:
            return (
                <div key={itemValue}>
                    <span ref={(el) => this.floatTooltip = el} >{'new tool tip'}</span>
                    <TmTooltip
                        tooltipValue={'adfasdfafdsdfs'}
                        getTargetEl={() => this.floatTooltip}
                        mode='infotip'
                    />

                    <p style={{margin: '10px', background: 'cornsilk'}}>
                        <b>TooltipHelper:</b>
                        <br />
                        <TooltipHelper value={'value only'}/>
                        <br />
                        <TooltipHelper
                            wrapperClassName={'wrapper'}
                            value={'value'}
                            tooltipValue={'tooltip value'}/>
                    </p>
                </div>
            );
        case 4:
            return (
                <div key={itemValue}>
                    <Button
                        bsStyle={'primary'}
                        block={false}
                        disabled={false}>
                        Save
                    </Button>
                    <Button
                        block={false}
                        disabled={false}>
                        Cancel
                    </Button>
                    <LabeledButton btnLabel='Button Label:' >
                        Button Text
                    </LabeledButton>
                    <Button
                        faStyle={'ban'}
                        block={false}
                        disabled={false}>
                        Cancel
                    </Button>
                    <Button
                        faStyle={'check'}
                        block={false}
                        disabled={false}>
                        Cancel
                    </Button>
                    <Button
                        faStyle={'trash'}
                        block={false}
                        disabled={false}>
                        Cancel
                    </Button>
                    <Button
                        faStyle={'pencil-square-o'}
                        bsStyle={'primary'}
                        block={false}
                        isDropdown
                        isCaretStyle
                        disabled={false}>
                        DropDown
                    </Button>
                    <Button
                        isLoading={true}
                        bsStyle={'danger'}
                        isDropdown
                        isCaretStyle
                        disabled={false}>
                        Loading
                    </Button>
                    <Button
                        iconEl={
                            <div style={{
                                width: '8px',
                                height: '8px',
                                background: 'white',
                                display: 'inline-block'
                            }} />
                        }
                        bsStyle={'danger'}
                        disabled={false}>
                        Custom Icon
                    </Button>
                    <br /><br />
                    <Button
                        faStyle={'star'}
                        buttonText={'default button'} />

                    <Button
                        faStyle={'star'}
                        bsStyle={'primary'}
                        bsSize={'sm'}
                        buttonText={'primary button'} />

                    <Button
                        faStyle={'star'}
                        bsStyle={'danger'}
                        bsSize={'xs'}
                        buttonText={'danger button'} />

                    <Button
                        faStyle={'star'}
                        bsStyle={'info'}
                        bsSize={'lg'}
                        buttonText={'info button'} />

                </div>
            );
        case 5:
            return (
                <div key={itemValue}>
                    <IconButton
                        glyphiconType={'star'}
                        buttonText={'default button'} />

                    <IconButton
                        glyphiconType={'star'}
                        bsStyle={'primary'}
                        bsSize={'sm'}
                        buttonText={'primary button'} />

                    <IconButton
                        glyphiconType={'star'}
                        bsStyle={'danger'}
                        bsSize={'xs'}
                        buttonText={'danger button'} />

                    <IconButton
                        glyphiconType={'star'}
                        bsStyle={'info'}
                        bsSize={'lg'}
                        buttonText={'info button'} />

                </div>
            );
        case 6:
            return (
                <div key={itemValue}>
                    <br/>

                    <InputGroup
                        placeholder={'Search Bar'}
                        rightFieldType={'button-group'}
                        rightField={<IconButton buttonText={'Search'} />} />
                    <br/>

                    <InputGroup
                        placeholder={'Search Bar'}
                        rightFieldType={'button-group'}
                        rightField={<IconButton isIconOnly={true} glyphiconType={'search'}/>} />
                    <br/>

                    <InputGroup
                        placeholder={'Search Bar'}
                        rightFieldType={'button-group'}
                        rightField={<IconButton glyphiconType={'search'} buttonText={' Search'} />} />
                    <br/>

                    <InputGroup
                        placeholder={'<left example> Glyphicon'}
                        leftFieldType={'others'}
                        leftField={<Glyphicon bsStyle={'user'} />}
                    />
                    <br/>

                    <InputGroup
                        placeholder={'<left example> checkbox'}
                        leftFieldType={'others'}
                        leftField={<input type={'checkbox'} />} />
                    <br/>

                    <InputGroup
                        placeholder={'<right example> string'}
                        rightFieldType={'others'}
                        rightField={'@'} />
                    <br/>

                    <InputGroup
                        placeholder={'<left & right> strings'}
                        leftFieldType={'others'}
                        leftField={'$'}
                        rightFieldType={'others'}
                        rightField={'.00'} />
                    <br/>
                </div>
            );
        case 7:
            return (
                <div key={itemValue}>
                    ConvenientDropdown:
                    <ConvenientDropdown
                        className={'ConvenientDropdown'}
                        style={{marginLeft: '10px'}}
                        disabled={false}
                        activeValue={this.state.convenientDropdownValue}
                        defaultTogglerTitle={'Select item...'}
                        options={[{
                            label: 'item1',
                            value: 'item1'
                        }, {
                            label: 'item2',
                            value: 'item2'
                        }, {
                            label: 'item3',
                            value: 'item3',
                            disabled: true
                        }]}
                        togglerBsStyle={'plain'}
                        listWidth={100}
                        listPullRight={false}
                        onSelect={(selectData, event) => {
                            console.info(selectData, event);
                            this.setState({
                                convenientDropdownValue: selectData
                            });
                        }}
                    />
                    <hr />

                    CustomDropdown:
                    {this.getDropdownDemo()}
                </div>
            );
        case 8:
            return (
                <div key={itemValue}>
                    <Collapse
                        titleText={'Connections details'}>
                        <ul>
                            <li>Lorem ipsum dolor sit amet...</li>
                        </ul>
                    </Collapse>
                </div>
            );
        case 9:
            return (
                <div key={itemValue}>
                    <Modal
                        closeBtn={true}
                        header={'Modal'}
                        bsSize={this.state.modalSize || 'md'}
                        body={
                            <div>
                                <p>Modal size:</p>
                                <IconButton buttonText={'xs'} onClick={() => {
                                    this.setState({modalSize: 'xs'});
                                }} />
                                <IconButton buttonText={'sm'} onClick={() => {
                                    this.setState({modalSize: 'sm'});
                                }} />
                                <IconButton buttonText={'md'} onClick={() => {
                                    this.setState({modalSize: 'md'});
                                }} />
                                <IconButton buttonText={'lg'} onClick={() => {
                                    this.setState({modalSize: 'lg'});
                                }} />
                            </div>
                        }
                        footer={
                            <div>
                                <IconButton buttonText={'save'} />
                                <IconButton buttonText={'cancel'} />
                            </div>
                        } />

                    <Modal
                        closeBtn={true}
                        bsSize={'xs'}
                        body={
                            <MediaObject
                                image={
                                    <Glyphicon bsStyle={'ok-circle'} className='text-success' />
                                }
                                titleText='Imported Successfully!'
                                content='4 duplicate records are found and merged'
                            />
                        }
                        footer={
                            <IconButton buttonText={'cancel'} />
                        } />
                    <ConfirmModalDialog
                        iconType='warn'
                        innerHeader='This is an inner header'
                        show={true}
                        confirmButtonText='Save'
                        cancelButtonText='Cancel'
                        useMediaObjectLayout={true}
                        isLoading={false}
                    >
                        {'This is a confirm dialog'}
                    </ConfirmModalDialog>
                </div>
            );
        case 10:
            return (
                <div key={itemValue}>
                    <Panel header={'Panel title -default'}>
                        Panel content
                    </Panel>
                    <Panel
                        header={'Panel title -primary (mask)'}
                        bsStyle={'primary'}
                        mask={true}>

                        <IconButton
                            glyphiconType={'star'}
                            buttonText={'default button'}
                            onClick={function() {
                                console.log('Clickable');
                            }} />
                        &nbsp;Panel content

                    </Panel>
                    <Panel header={'Panel title -success'} bsStyle={'success'}>
                        Panel content
                    </Panel>
                    <Panel header={'Panel title -info'} bsStyle={'info'}>
                        Panel content
                    </Panel>
                    <Panel header={'Panel title -warning'} bsStyle={'warning'}>
                        Panel content
                    </Panel>
                    <Panel header={'Panel title -danger'} bsStyle={'danger'}>
                        Panel content
                    </Panel>
                    <Panel header={'Panel with footer'} footer={<p>Panel Footer</p>}  bsStyle={'danger'}>
                        Panel content <br /><br /><br />
                    </Panel>
                    <Panel
                        header={<IconButton glyphiconType={'ok'} buttonText={' Panel heading without title'} />}  bsStyle={'danger'} >
                        Panel content
                    </Panel>
                    <Panel>
                        Panel content only
                    </Panel>
                    <CollapsiblePanel titleText='this is Collapsible Panel'>
                        This is a test.....
                    </CollapsiblePanel>
                </div>
            );
        case 11:
            const { fileName, fileSize } = this.state;
            return (
                <div key={itemValue}>
                    <h3>Basic</h3>
                    <FileUpload
                        onFileChange={(component, fileName, fileExt, fileSize, e) => {}} />
                    <h3>Basic without tooltip</h3>
                    <FileUpload
                        tooltip={false}
                        onFileChange={(component, fileName, fileExt, fileSize, e) => {}} />
                    <h3>Basic with tooltip, without filesize</h3>
                    <FileUpload
                        tooltip={true}
                        displayFileSize={false}
                        onFileChange={(component, fileName, fileExt, fileSize, e) => {}} />
                    <h3>Custom renderer for filename and tooltip</h3>
                    <FileUpload
                        onFileChange={(component, fileName, fileExt, fileSize, e) => {}}
                        tooltipRenderer={({ name, ext, size, sizeDisplay }) => {
                            return `hello! ${name} (${sizeDisplay})`;
                        }}
                        fileNameRenderer={({ name, ext, size, sizeDisplay }) => {
                            return `hello! ${name}`;
                        }}
                    />
                    <h3>Filename and size from props</h3>
                    <FileUpload
                        ref={(el) => this.inputFileEl = el}
                        onFileChange={(component, fileName, fileExt, fileSize, e) => {
                            this.setState({
                                fileName,
                                fileSize
                            });
                        }}
                        onClear={(component, fileName, fileExt, fileSize) => {
                            this.setState({
                                fileName,
                                fileSize
                            });
                        }}
                        isDataFromProps={true}
                        fileName={fileName}
                        fileSize={fileSize}
                        // displayActionButton
                        // displayFileNamePlacement={['left', 'right']}
                    />
                    <Panel header={'API'} style={{marginTop: 10}}>
                        <p>{`fileName: ${fileName}`}</p>
                        <p>{`fileSize: ${fileSize}`}</p>
                        <Button
                            onClick={() => {
                                console.info('getInputCompo', this.inputFileEl.getInputCompo());
                            }}
                        >
                            getInputCompo()
                        </Button>
                        <Button
                            onClick={() => {
                                console.info('getValue', this.inputFileEl.getValue());
                            }}
                        >
                            getValue()
                        </Button>
                        <Button
                            onClick={() => {
                                console.info('getFileInfo', this.inputFileEl.getFileInfo());
                            }}
                        >
                            getFileInfo()
                        </Button>
                        <Button
                            onClick={() => {
                                this.setState({
                                    fileName: 'changefilename.txt',
                                    fileSize: 98765
                                });
                            }}
                        >
                            Change state
                        </Button>
                    </Panel>
                </div>
            );
        case 12:
            return (
                <div key={itemValue}>
                    <Loader loaderText={'Uploading...'} />
                    <br />
                    <Loader bsSize={'sm'} />
                    <br />
                    <Loader bsSize={'md'} />
                    <br />
                    <Loader bsSize={'lg'} />
                    <br />
                </div>
            );
        case 13:
            return (
                <div key={itemValue}>
                    <FormPanel ref={'dirtyCheckForm'}>
                        <RadioGroup
                            ref={'-RadioGroup'}
                            selectedValue={this.state.radioGroup}
                            items={[
                                {value: 'opt1', labelText: 'radio group 1-1', name: 'radioGroup'},
                                {value: 'opt2', labelText: 'radio group 1-2', name: 'radioGroup'},
                                {value: 'opt3', labelText: 'radio group 1-3', name: 'radioGroup'}
                            ]}
                            onChange={this.handleRadioChange} />

                        <CheckboxGroup
                            ref={'-CheckboxGroup'}
                            items={[
                                {labelText: 'Checkbox group 1-1', value: 'ckboxgrp21'},
                                {labelText: 'Checkbox group 1-2', value: 'ckboxgrp22'},
                                {labelText: 'Checkbox group 1-3', value: 'ckboxgrp23'}
                            ]} />


                        <Checkbox ref={'-Checkbox1'} labelText={'single checkbox without "value"'} />
                        <Checkbox ref={'-Checkbox2'} labelText={'single checkbox without "value"'} defaultChecked={true} />
                        <Checkbox
                            ref={'-Checkbox3'}
                            labelText={'single checkbox with "value"'}
                            value={'singleCheckbox'} />
                        <Checkbox
                            ref={'-Checkbox4'}
                            labelText={'single checkbox with "value"'}
                            value={'singleCheckbox'}
                            defaultChecked={true} />

                        <TextField ref={'-TextField'} labelText={'TextField:'} placeholder={'for dirty check'} />

                        <Select
                            ref={'-Select'}
                            items={[
                                {value: 'opt1', text: 'This is Option1'},
                                {value: 'opt2', text: 'This is Option2'},
                                {value: 'opt3', text: 'This is Option3'}
                            ]}
                            labelText={'Select:'}
                            defaultValue={'opt2'} />
                        <FileUpload ref={'-FileUpload'} />
                        <hr />
                        <IconButton
                            buttonText={'DirtyCheck'}
                            onClick={() => {
                                const children = this.refs.dirtyCheckForm.props.children;
                                React.Children.forEach(children, (child, i) => {
                                    let childComp = this.refs[child.ref];
                                    if (childComp) {
                                        let isDirty = childComp.isDirty();
                                        console.log(child.ref, '    isDirty:', isDirty);
                                    }
                                });
                                console.log('------------------------------------');
                            }} />
                        <IconButton
                            buttonText={'ClearDirty'}
                            onClick={() => {
                                const children = this.refs.dirtyCheckForm.props.children;
                                React.Children.forEach(children, (child, i) => {
                                    let childComp = this.refs[child.ref];
                                    if (childComp) {
                                        childComp.cleanDirty();
                                    }
                                });
                                console.log('cleanDirty');
                            }}  />
                        Using console.
                    </FormPanel>
                </div>
            );
        case 14:
            return (
                <div key={itemValue}>
                    <button onClick={() => {
                        console.info('SelectedDate: ', this.refs.dtp.getValue());
                        console.info('isValid: ', this.refs.dtp.isValid());
                    }}> Get Value </button>
                    <br/>
                    <div>
                        <Button
                            buttonText={'DateTimePicker: getValue'}
                            onClick={() => {
                                console.info({
                                    value: this.refs.dtp1.getValue(),
                                    isValid: this.refs.dtp1.isValid()
                                });
                            }} />
                        <DateTimePicker
                            ref={'dtp1'}
                            validator={(selectedDate) => {
                                return moment.isMoment(selectedDate);
                            }}
                            dateFormat={false}
                            timeFormat={'HH:mm'}
                            defaultValue={moment()} />
                        <br />

                        <Button
                            buttonText={'DateTimePicker: getValue'}
                            onClick={() => {
                                console.info({
                                    value: this.refs.dtp2.getValue(),
                                    isValid: this.refs.dtp2.isValid()
                                });
                            }} />
                        <DateTimePicker
                            ref={'dtp2'}
                            validator={(selectedDate) => {
                                return moment.isMoment(selectedDate);
                            }}
                            defaultValue={moment()} />
                        <br />

                        <Button
                            buttonText={'DateTimePicker: getValue'}
                            onClick={() => {
                                console.info({
                                    value: this.refs.dtp3.getValue(),
                                    isValid: this.refs.dtp3.isValid()
                                });
                            }} />
                        <DateTimePicker
                            ref={'dtp3'}
                            onChange={(selectedDate) => {
                                if (moment.isMoment(selectedDate)) {
                                    this.setState({dtp3Value: selectedDate});
                                } else {
                                    const currStateValue = this.state.dtp3Value;
                                    this.setState({dtp3Value: currStateValue});
                                }
                            }}
                            value={this.state.dtp3Value || moment([1970, 0, 28])} />
                    </div>
                </div>
            );
        case 15:
            return (
                <div key={itemValue}>
                    <button onClick={() => {
                        console.info('SelectedDate: ', this.refs.dtrp.getValue());
                        console.info('isValid: ', this.refs.dtrp.isValid());
                    }}> Get Value </button>

                    <div>
                        <Button
                            buttonText={'DateTimeRangePicker: getValue'}
                            onClick={() => {
                                console.info({
                                    value: this.refs.dtrp.getValue(),
                                    isValid: this.refs.dtrp.isValid()
                                });
                            }} />
                        <p>Limit range for 7 days</p>
                        <DateTimeRangePicker
                            ref={'dtrp'}
                            fromTimeValue={moment()}
                            toTimeValue={moment().add(6, 'days')}
                            limitRange={6*24*60*60}
                        />
                        <br />

                        <Button
                            buttonText={'DateTimeRangePicker: getValue'}
                            onClick={() => {
                                console.info({
                                    value: this.refs.dtrp.getValue(),
                                    isValid: this.refs.dtrp.isValid()
                                });
                            }} />
                        <Button
                            buttonText={'DateTimeRangePicker: FromCalendar + 1 day'}
                            onClick={() => {
                                this.setState({
                                    dtrp2From: moment(this.state.dtrp2From).add(1, 'd')
                                });
                            }} />
                        <DateTimeRangePicker
                            ref={'dtrp2'}
                            onRangeChange={(fromTime, toTime) => {
                                this.setState({
                                    dtrp2From: moment(fromTime),
                                    dtrp2To: moment(toTime),
                                });
                            }}
                            fromTimeValue={this.state.dtrp2From}
                            toTimeValue={this.state.dtrp2To}
                        />
                    </div>
                </div>
            );
        case 16:
            return (
                <div key={itemValue}>
                    {this.getDropdownDateTimePickerDemo()}
                </div>
            );
        case 17:
            return (
                <div key={itemValue}>
                    <div
                        style={{
                            background: 'red',
                            minHeight: '100px',
                            minWidth: '100px'
                        }}
                        className={'maskContainer'}>

                        <Mask isLoading={true} />
                    </div>
                </div>
            );
        case 18:
            return (
                <div key={itemValue}>
                    <Fieldset title={'This is fieldset title'}>
                        {'This is content'}
                    </Fieldset>
                </div>
            );
        case 19:
            return (
                <div key={itemValue}>
                    <QueryBuilder
                        defaultRules={[{
                            field: 0,
                            operator: 1,
                            value: 1
                        }]}
                        conditionLabel={{
                            and: {
                                cmp: ColorLabel,
                                props: {
                                    children: 'AND'
                                }
                            }
                        }}
                        removeButton={{
                            cmp: Button,
                            props: {
                                faStyle: 'minus',
                                onClick: this.onRuleRemove
                            }
                        }}
                        addButton={{
                            cmp: Button,
                            props: {
                                faStyle: 'plus',
                                onClick: this.onAddNewRuleClick
                            }
                        }}
                        emptyAddButton={<a href='javascript:void(0);'>Add new</a>}
                        rootRules={this.state.queryBuilder.rootRules}
                        filters={{
                            fieldCmp: Select,
                            fieldCmpProps: {
                                items: [
                                    {value: '0', text: 'Detection Type'},
                                    {value: '1', text: 'Detection Rule ID'}
                                ]
                            },
                            paired: {
                                '0': {
                                    operatorCmps: {
                                        operatorCmp: Select,
                                        operatorProps: {
                                            items: [
                                                {value: true, text: 'in'},
                                                {value: false, text: 'not in'}
                                            ]
                                        }
                                    },
                                    valueCmps: {
                                        '_main': {
                                            valueCmp: Select,
                                            valueProps: {
                                                items: [
                                                    {value: '0', text: 'Malicious Conetent'},
                                                    {value: '1', text: 'Grayware'}
                                                ]
                                            }
                                        },
                                        'true': {
                                            valueCmp: Select,
                                            valueProps: {
                                                items: [
                                                    {value: '0', text: 'test'},
                                                    {value: '1', text: 'test2'}
                                                ]
                                            }
                                        }
                                    }
                                },
                                '1': {
                                    operatorCmps: {
                                        operatorCmp: Select,
                                        operatorProps: {
                                            items: [
                                                {value: true, text: 'in'},
                                                {value: false, text: 'not in'}
                                            ]
                                        }
                                    },
                                    valueCmps: {
                                        '_main': {
                                            valueCmp: TextField,
                                            valueProps: {}
                                        }
                                    }
                                }
                            }
                        }}
                        onQueryFieldChange={this.onQueryFieldChange}
                        onQueryOperatorChange={this.onQueryOperatorChange}
                        onQueryValueChange={this.onQueryValueChange}
                        onAddNewRuleClick={this.onAddNewRuleClick} />
                </div>
            );
        case 20:
            return (
                <div key={itemValue}>
                    <SmartFilterQueryBuilderSample />
                </div>
            );
        case 21:
            return (
                <div key={itemValue}>
                    <TmAgGrid
                        enableCustomSelection={false}
                        enableMaxGridHeight={true}
                        columnDefs={[
                            {headerName: 'Make', field: 'make'},
                            {headerName: 'Model', field: 'model'},
                            {headerName: 'Price', field: 'price'}
                        ]}
                        allRowData={[
                            {make: 'Toyota', model: 'Celica', price: 35000},
                            {make: 'Ford', model: 'Mondeo', price: 32000},
                            {make: 'Porsche', model: 'Boxter', price: 72000}
                        ]}
                    />
                    <br />
                    <TmAgGrid
                        enableCustomSelection={false}
                        enableMaxGridHeight={true}
                        columnDefs={[{
                            headerName: 'Product',
                            field: 'Product'
                        }, {
                            headerName: 'Price (Editable Text)',
                            field: 'price',

                            // Editable column settings
                            editable: true,
                            cellClass: 'no-padding',
                            cellRendererFramework: TmAgGrid.textEditableCell,
                            cellRendererParams: {
                                validator: ({value}) => !isNaN(value)
                            },
                            cellEditorFramework: TmAgGrid.textEditor,
                            cellEditorParams: {
                                helpTextRenderer: ({inputValue, value}) => 'Price must be a number',
                                validator: ({inputValue, value}) => !isNaN(inputValue),
                                onComplete: ({inputValue, newValue, newAllRowData, ...rest}) => {
                                    console.info({ inputValue, newValue, newAllRowData, rest });
                                    this.setState({
                                        editableAgGridData: newAllRowData
                                    });
                                }
                            }
                        }]}
                        allRowData={this.state.editableAgGridData || [
                            {Product: 'Pen', price: '10'},
                            {Product: 'Apple', price: '15'},
                            {Product: 'Pineapple', price: 'N/A'}
                        ]}
                    />
                    <br />
                    <TmAgGrid
                        className='test tm-grid-ex-1'
                        enableCustomSelection={true}
                        enableMaxGridHeight={true}
                        keyField={'id'}
                        columnDefs={[
                            {headerName: 'Make', field: 'make'},
                            {headerName: 'Model', field: 'model'},
                            {headerName: 'Price', field: 'price'}
                        ]}
                        allRowData={[
                            {id: 'id1', make: 'Toyota', model: 'Celica', price: 35000},
                            {id: 'id2', make: 'Ford', model: 'Mondeo', price: 32000},
                            {id: 'id3', make: 'Porsche', model: 'Boxter', price: 72000}
                        ]}
                        onSelectChange={(newSelection) => {
                            this.setState({
                                tmAgGridSelection: newSelection
                            });
                        }}
                        selectModel={this.state.tmAgGridSelection || [{
                            id: 'id2',
                            make: 'Ford',
                            model: 'Mondeo',
                            price: 32000
                        }]}

                        // i18n
                        pageSizeActiveValueRender={(pageSizeItem) => `${pageSizeItem.label} per page`}
                        rowRangeInfoLabel={'Records:'}
                        overlayNoRowsTemplate={'No data to display'}
                    />
                    <br />
                    <TmAgGrid
                        className='test tm-grid-ex-2'
                        enableCustomSelection={true}
                        enableMaxGridHeight={true}
                        keyField={'id'}
                        columnDefs={[
                            {headerName: 'Make', field: 'make'},
                            {headerName: 'Model', field: 'model'},
                            {headerName: 'Price', field: 'price'}
                        ]}
                        allRowData={[
                            {id: 'ex1', make: 'Toyota', model: 'Celica', price: 35000},
                            {id: 'ex2', make: 'Ford', model: 'Mondeo', price: 32000},
                            {id: 'ex3', make: 'Porsche', model: 'Boxter', price: 72000}
                        ]}
                        onSelectChange={(newSelection) => {
                            this.setState({
                                tmAgSelection: newSelection
                            });
                        }}
                        selectModel={this.state.tmAgSelection || []}

                        // i18n
                        pageSizeActiveValueRender={(pageSizeItem) => `${pageSizeItem.label} per page`}
                        rowRangeInfoLabel={'Records:'}
                        overlayNoRowsTemplate={'No data to display'}
                    />
                </div>
            );
        case 22:
            const multipleSelectionProps = {
                selectableLabel: 'Left title',
                selectedLabel: 'Right title',
                selectedValues: ['c', 'e'],
                standalone: true,
                items: [
                    {
                        label: 'Option A',
                        value: 'a',
                        group: 'DDI'
                    },
                    {
                        label: 'Option B',
                        value: 'b',
                        group: 'DDI'
                    },
                    {
                        label: 'Option C',
                        value: 'c',
                        group: 'DDI'
                    },
                    {
                        label: 'Option D',
                        value: 'd',
                        group: 'DDI'
                    },
                    {
                        label: 'Option E',
                        value: 'e',
                        group: 'DDD'
                    },
                    {
                        label: 'Option F',
                        value: 'f',
                        group: 'DDD'
                    }
                ],
                validator: ({ component, selectedValues }) => {
                    if (selectedValues.length === 0) {
                        return 'Select at least one';
                    } else {
                        return true;
                    }
                }
            };
            const onItemChanged = (stateKey) => ({ selectedValues }) => {
                this.setState({
                    [stateKey]: selectedValues
                });
            };

            return (
                <div key={itemValue}>
                    <h3>Basic</h3>
                    <MultipleSelection
                        {...multipleSelectionProps}
                        ref={(el) => this.multipleSelectionEl = el}
                        useGroup={false}
                        disabled={false}
                        selectedValues={this.state.selectedValuesBasic}
                        onItemChanged={onItemChanged('selectedValuesBasic')}
                    />
                    <Panel header={'API'} style={{marginTop: 10}}>
                        <Button
                            onClick={() => {
                                console.info(this.multipleSelectionEl.isValid());
                            }}
                        >
                            isValid()
                        </Button>
                        <Button
                            onClick={() => {
                                this.multipleSelectionEl.resetValidation();
                            }}
                        >
                            resetValidation()
                        </Button>
                    </Panel>
                    <h3>Basic with disabled</h3>
                    <MultipleSelection
                        {...multipleSelectionProps}
                        useGroup={false}
                        disabled={true}
                        selectedValues={this.state.selectedValuesBasicWithDisabled}
                        onItemChanged={onItemChanged('selectedValuesBasicWithDisabled')}
                    />
                    <h3>Grouped options</h3>
                    <MultipleSelection
                        {...multipleSelectionProps}
                        useGroup={true}
                        disabled={false}
                        groupLabelMaps={{
                            DDI: 'Group DDI',
                            DDD: 'Group DDD'
                        }}
                        selectedValues={this.state.selectedValuesGroup}
                        onItemChanged={onItemChanged('selectedValuesGroup')}
                    />
                    <h3>Grouped options with disabled</h3>
                    <MultipleSelection
                        {...multipleSelectionProps}
                        useGroup={true}
                        disabled={true}
                        selectedValues={this.state.selectedValuesGroupWithDisabled}
                        onItemChanged={onItemChanged('selectedValuesGroupWithDisabled')}
                    />
                </div>
            );
        case 23:
            return (
                <div key={itemValue}>
                    <Panel header={'Portal demo'} style={{marginTop: 10}}>
                        <Button
                            onClick={() => {
                                this.setState({ showPortalModal: true });
                            }}
                        >
                            show modal
                        </Button>
                    </Panel>
                    {this.state.showPortalModal &&
                        <Portal>
                            <Modal
                                closeBtn={true}
                                header='Modal'
                                bsSize='md'
                                body='This modal is render at the end of document.body' />
                        </Portal>
                    }
                </div>
            );
        case 24:
            return (
                <div key={itemValue}>
                    <h3>SearchBox w/o left icon</h3>
                    <SearchBox
                        // icon
                        showLeftIcon={false}

                        displaySearchBtn={true}
                        disabled={false}
                        textFieldProps={{
                            placeholder: 'Search something'
                        }}
                        onClear={() => {
                            console.info('text clear');
                        }}
                        onSearch={(text) => {
                            console.info('Search: ', (text ? text : '""'));
                        }}
                    />
                    <h3>SearchBox w/o left icon w/o search button</h3>
                    <SearchBox
                        // icon
                        showLeftIcon={false}

                        displaySearchBtn={false}
                        disabled={false}
                        textFieldProps={{
                            placeholder: 'Search something'
                        }}
                        onClear={() => {
                            console.info('text clear');
                        }}
                        onSearch={(text) => {
                            console.info('Search: ', (text ? text : '""'));
                        }}
                    />
                    <h3>SearchBox with left icon w/o search button</h3>
                    <SearchBox
                        // icon
                        showLeftIcon={true}

                        displaySearchBtn={false}
                        disabled={false}
                        textFieldProps={{
                            placeholder: 'Search something'
                        }}
                        onClear={() => {
                            console.info('text clear');
                        }}
                        onSearch={(text) => {
                            console.info('Search: ', (text ? text : '""'));
                        }}
                    />
                    <h3>ClearableTextField with left icon</h3>
                    <ClearableTextField
                        // icon
                        showLeftIcon={true}
                        leftIconName='search-o'

                        displaySearchBtn={false}
                        disabled={false}
                        placeholder='Search something'
                        onClear={() => {
                            console.info('text clear');
                        }}
                        onChange={(text) => {
                            console.info('Search: ', (text ? text : '""'));
                        }}
                    />
                    <h3>ClearableTextField w/o left icon</h3>
                    <ClearableTextField
                        // icon
                        showLeftIcon={false}
                        leftIconName='search-o'

                        displaySearchBtn={false}
                        disabled={false}
                        placeholder='Search something'
                        onClear={() => {
                            console.info('text clear');
                        }}
                        onChange={(text) => {
                            console.info('Search: ', (text ? text : '""'));
                        }}
                    />
                </div>
            );
        case 25:
            const nodes = [{
                value: 'A',
                label: 'A',
                icon: (
                    <TmIcon name='search-o' />
                ),
                deviceCount: 2,
                children: [{
                    value: 'B',
                    label: 'B',
                    icon: (
                        <Glyphicon bsStyle={'ok'} />
                    ),
                    children: [
                        { value: 'b1', label: 'b1' },
                        { value: 'b2', label: 'b2' }
                    ]
                }, {
                    value: 'C',
                    label: 'C'
                }]
            }, {
                value: 'D',
                label: 'D',
                icon: 'test icon',
                children: [{
                    value: 'E',
                    label: 'E'
                }, {
                    value: 'F',
                    label: 'FF'
                }]
            }, {
                value: 'D1',
                label: 'DD1',
                children: [{
                    value: 'E1',
                    label: 'EE1'
                }, {
                    value: 'F1',
                    label: 'FF1'
                }]
            }, {
                value: 'D2',
                label: 'DD2',
                children: [{
                    value: 'E2',
                    label: 'EE2'
                }, {
                    value: 'F2',
                    label: 'FF2'
                }]
            }, {
                value: 'D3',
                label: 'DD3',
                children: [{
                    value: 'E3',
                    label: 'EE3'
                }, {
                    value: 'F3',
                    label: 'FF3'
                }]
            }, {
                value: 'D4',
                label: 'DD4',
                children: [{
                    value: 'E4',
                    label: 'EE4'
                }, {
                    value: 'F4',
                    label: 'FF4'
                }]
            }, {
                value: 'D5',
                label: 'DD5',
                children: [{
                    value: 'E5',
                    label: 'EE5'
                }, {
                    value: 'F5',
                    label: 'FF5'
                }]
            }];
            const allChecked = ['b1', 'b2', 'C', 'E', 'F', 'E1', 'F1', 'E2', 'F2', 'E3', 'F3', 'E4', 'F4', 'E5', 'F5'];
            const checkedCount = _.size(this.state.checked);
            return (
                <div key={itemValue}>
                    <h3>TreeDropdown</h3>
                    <TreeDropdown
                        wrappedComponentRef={el => this.treeDropdownElment = el}
                        className='tree-dropdown-demo'
                        // menu
                        togglePlaceholder='Select'
                        // toggleRenderer={({ element }) => {
                        //     return 'toggle text';
                        // }}
                        // toggleContentRenderer={({ element }) => {
                        //     return element.props.checked.join(', ');
                        // }}
                        // toggleTextRenderer={({ element }) => {
                        //     return element.props.checked.join(', ');
                        // }}

                        // search bar
                        showSearchBox={true}
                        searchBoxPlaceholder='Search'
                        searchEmptyText='No item was found.'
                        clearFilterTextOnClose={true}
                        listPullRight={false}

                        // fixed node
                        fixedNodesRenderer={(e) => {
                            return (
                                <span className={classNames({
                                    'checkbox': true,
                                    'checkbox-info': true
                                })}>
                                    <IndeterminateCheckbox
                                        id='inputId'
                                        checked={checkedCount > 0}
                                        indeterminate={checkedCount > 0 && checkedCount !== _.size(allChecked)}
                                        onChange={(e) => {
                                            this.setState({
                                                checked: e.target.checked ? allChecked : []
                                            }, () => {
                                                this.treeDropdownElment.validate();
                                            });
                                        }} />
                                    <label htmlFor='inputId'>
                                        {'All'}
                                    </label>
                                </span>
                            );
                        }}

                        // checkbox tree
                        nodes={nodes}
                        checked={this.state.checked}
                        expanded={this.state.expanded}
                        labelRenderer={({ node, Highlighter, searchKeyword, element }) => {
                            const { label, deviceCount } = node;
                            // return _.isUndefined(deviceCount) ?
                            //     node.label :
                            //     `${node.label} (${node.deviceCount})`;
                            return (
                                <span className='rct-label'>
                                    <Highlighter
                                        autoEscape={true}
                                        searchWords={[element.getSpaceEncode(searchKeyword)]}
                                        textToHighlight={element.getSpaceEncode(label)}
                                    />
                                </span>
                            );
                        }}
                        validator={({ element, newValue, oldValue }) => {
                            if (newValue.length === 0) {
                                return 'value is required';
                            }
                            return true;
                        }}
                        onCheck={(checked) => {
                            console.info('checked', checked);
                            this.setState({ checked });
                        }}
                        onExpand={(expanded) => {
                            console.info('expanded', expanded);
                            this.setState({ expanded });
                        }}
                    >
                        {'footer'}
                    </TreeDropdown>
                    <h3>CheckboxTree</h3>
                    <CheckboxTree
                        nodes={nodes}
                        checked={this.state.checked}
                        expanded={this.state.expanded}
                        onCheck={(checked) => {
                            console.info('checked', checked);
                            this.setState({ checked });
                        }}
                        onExpand={(expanded) => {
                            console.info('expanded', expanded);
                            this.setState({ expanded });
                        }}
                    />
                </div>
            );
        default:
            return null;
        }
    }

    render() {
        const divStyle = {
            marginLeft: '15px',
            marginRight: '15px',
            marginTop: '30px',
            marginBottom: '30px'
        };

        // render single tab content for debug
        // return (
        //     <div style={divStyle}>
        //         {this.renderTabContents(24)}
        //     </div>
        // );

        return (
            <div style={divStyle}>
                <div>
                    <ProductLogo>
                        Deep Discovery Inspector
                    </ProductLogo>
                </div>

                <Navbar
                    className={'test-nav'}
                    activeMenu={this.state.activeNavMenu || ['nav2', 'nav2-2']}
                    onSelect={({activeMenu, activeItem}) => {
                        this.setState({
                            activeNavMenu: activeMenu
                        });
                        activeItem.onClick();
                    }}
                    navItems={[{
                        value: 'nav1',
                        label: 'Link 1',
                        hide: false,
                        className: 'class-nav1',
                        onClick: () => {
                            console.info('nav1');
                        }
                    }, {
                        value: 'navhide',
                        label: 'Link hide',
                        hide: true
                    }, {
                        value: 'nav2',
                        label: 'Link 2',
                        subItems: [{
                            value: 'nav2-1',
                            label: 'Menu item one',
                            className: 'class-nav2-1',
                            onClick: () => {
                                console.info('nav2-1');
                            }
                        }, {
                            divider: true
                        }, {
                            value: 'nav2-2',
                            label: 'Menu item two',
                            onClick: () => {
                                console.info('nav2-2');
                            }
                        }, {
                            value: 'nav2-3',
                            label: 'Menu item three (disabled)',
                            disabled: true,
                            onClick: () => {
                                console.info('nav2-3');
                            }
                        }, {
                            value: 'nav2-4',
                            label: 'Menu item four (hidden)',
                            hide: true,
                            onClick: () => {
                                console.info('nav2-4');
                            }
                        }]
                    }]}
                />

                <Breadcrumb>
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>react-commercial-bootstrap</BreadcrumbItem>
                    <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
                </Breadcrumb>

                <FormPanel>
                    <ACKey
                        labelText={'Activation code:'}
                        mask={'XX-XXXX-XXXX-XXXX-XXXX'}
                    />
                    <FileUpload
                        labelText={'FileUpload:'}
                        tooltip={false}
                        onFileChange={
                            function(component, fileName, fileExt, fileSize, e) {}
                        } />
                    <Select
                        ref={'select1'}
                        items={[
                            {value: 'opt1', text: 'This is Option1'},
                            {value: 'opt2', text: 'This is Option2'},
                            {value: 'opt3', text: 'This is Option3'}
                        ]}
                        labelText={'test select:'}
                        defaultValue={'opt1'}
                        onChange={this.handleSelectChange} />
                    <LabelField
                        className={'firstLabel'}
                        labelText={'This is label text:'}
                        value={'this is value'} />
                    <LabelField labelText={'This is label text:'} value={<Button> Button </Button>} />
                    <CheckboxGroup
                        ref={'cbg'}
                        items={[
                            {labelText: 'Checkbox group 1-1', value: 'ckboxgrp11'},
                            {labelText: 'Checkbox group 1-2', value: 'ckboxgrp12', checked: this.state.ckboxgrp12},
                            {labelText: 'Checkbox group 1-3', value: 'ckboxgrp13'}
                        ]}
                        onChange={this.handleCheckboxChange} />

                    <Checkbox
                        labelText={'single checkbox'}
                        value={'singleCheckbox'}
                        data-name={'test'}
                        disabled
                        checked={this.state.singleCheckbox} />

                    <Checkbox
                        labelText={'single checkbox'}
                        value={'singleCheckbox'}
                        data-name={'test'}
                        defaultChecked={this.state.singleCheckbox} />

                    <RadioGroup
                        ref={'rg'}
                        selectedValue={this.state.radioGroup}
                        items={[
                            {value: 'opt1', labelText: 'radio group 1-1', name: 'radioGroup'},
                            {value: 'opt2', labelText: 'radio group 1-2', name: 'radioGroup'},
                            {value: 'opt3', labelText: 'radio group 1-3', name: 'radioGroup'}
                        ]}
                        onChange={this.handleRadioChange} />

                    <Radio
                        name={'singleradio'}
                        labelText={'single radio'}
                        defaultChecked
                        value={'singleradio'} />

                    <TextField
                        ref={'test1'}
                        helpText={'This is invalid text'}
                        labelText={'This is first TextField:'}
                        placeholder={'Type user name'}
                        onValueChange={this.handleNameChange}
                        tooltipProps={{
                            tooltipValue: 'test',
                            placement: 'top',
                            mode: 'popover'
                        }}
                        value={this.state.nameValue} />

                    <TextField
                        ref={'name'}
                        labelText={'This is second TextField with right text'}
                        placeholder={'Type user name'}
                        onValueChange={this.handleNameChange}
                        helpText={'this is for test'}
                        validator={(field, text) => {
                            if (text.length > 2) {
                                return false;
                            } else {
                                return true;
                            }
                        }}
                        value={this.state.nameValue} />
                    <Button
                        bsStyle={'danger'}
                        block={false}
                        disabled={false}>Test
                    </Button>
                </FormPanel>

                Has error:
                <HelpText validationState={'has-error'} text={'Error message example'} />

                <div>
                    Badge examples:
                    <Badge>1</Badge>
                </div>

                <Alert titleText={'Warning!'} onClose={() => {
                    return Promise.resolve(true);
                }}>
                    <p>This is a warning message.</p>
                </Alert>

                <Alert bsStyle={'success'}>
                    <strong>Successfully!</strong>
                    <p>This is a  successful message.</p>
                </Alert>

                <Alert bsStyle={'success'} titleText={'Successfully!'}>
                    <p>This is a  successful message.</p>
                </Alert>

                <Alert bsStyle={'info'} titleText={'Infomation!'} onClose={this.handleAlertDismiss}>
                    <p>This is an infomation.</p>
                </Alert>

                <Alert bsStyle={'danger'} titleText={'Error!'} onClose={this.handleAlertDismiss}>
                    <p>This is an error message.</p>
                    <p>This is an long long long long long long long long long long long long long long error message.</p>
                </Alert>

                <Alert titleText={'Warning!'} closable={false}>
                    <p>This is an un-closable warning message.</p>
                </Alert>

                <Alert bsStyle={'info'} titleText={'Infomation!'} isShortMsg={true}>
                    This is an short infomation.
                </Alert>

                <Panel header={'This is TM commercial-bootstrap Panel'}>
                    <ul>
                        <li>Lorem ipsum dolor sit amet...</li>
                    </ul>
                </Panel>

                <form>
                    <LabelField labelText={'This is label text:'} value={'this is value'} />
                    <TextField
                        ref={'name'}
                        bsSize={'xlarge'}
                        bsStyle={'error'}
                        helpText={'This is invalid text'}
                        labelText={'Name Validator TextField:'}
                        placeholder={'Type user name'}
                        onValueChange={this.handleNameChange}
                        value={this.state.nameValue}
                        validator={
                            function(textField, text) {
                                let props = textField.props;
                                if (text.length > 10) {
                                    return false;
                                } else if (text.length > 5) {
                                    return 'String length should shorter than 5';
                                }
                                return true;
                            }
                        } />
                    <Select
                        labelText={'This is first Select:'}
                        items={[
                            {value: 'opt1', text: 'This is Option1'},
                            {value: 'opt2', text: 'This is Option2'},
                            {value: 'opt3', text: 'This is Option3'}
                        ]}
                        defaultValue={'opt1'} />
                </form>
                <br/>

                Glyphicon: &nbsp;&nbsp;
                <Glyphicon bsStyle={'download-alt'} />
                <Glyphicon bsStyle={'ban-circle'} />
                <Glyphicon bsStyle={'ok'} />
                <Glyphicon bsStyle={'trash'} />
                <Glyphicon bsStyle={'search'} />
                <HelpText glyphiconType={'ok'} text={'this is help text'}/>
                <br/><br/>

                <Tabbable
                    ref={(ref) => {
                        this.tabbable = ref;
                    }}
                    cover={false}
                    activeTab={this.state.activeTab}
                    bsStyleNavTabs={'tabs'}
                    enableReordering={true}
                    items={this.state.tabItems}
                    leftPane={<label>Active: {this.state.activeTab}</label>}
                    reorderTab={this.handleReorderTab}
                    rightPane={<button onClick={() => {
                        this.tabbable.scrollRight();
                    }}>Add</button>}
                    onSubMenuClick={(menu, tab) => console.log(menu, tab)}
                    onTabsSizeUpdate={(size) => console.log('tabSize', size)}
                    onClick={this.handleNavTabsClick}>
                    {this.state.tabItems.map((item) => {
                        return this.renderTabContents(item.value);
                    })}
                </Tabbable>
                <br/><br/>
            </div>
        );
    }
}

document.querySelector('body').className = 'commercial-theme tm-log-on-standard';
document.querySelector('#test').className = 'tm-wrap';
ReactDOM.render(<App />, document.getElementById('test'));
