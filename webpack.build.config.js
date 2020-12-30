var webpack = require('webpack')
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var path = require('path')
var basic = require(path.resolve(__dirname + '/basic.loaders'));

module.exports = {
    entry: {
        index: './src/index.js',
        Alert: ['./src/alert/Alert.js'],
        Badge: ['./src/badge/Badge.js'],
        Breadcrumb: ['./src/breadcrumb/Breadcrumb.js'],
        Button: ['./src/button/Button.js'],
        CaretIcon: ['./src/collapse/CaretIcon.js'],
        Checkbox: ['./src/forms/Checkbox.js'],
        CheckboxGroup: ['./src/forms/CheckboxGroup.js'],
        CheckboxTable: ['./src/table/checkboxTable.js'],
        CheckboxTree: ['./src/tree/CheckboxTree.js'],
        ClearableTextField: ['./src/forms/searchBox/ClearableTextField.js'],
        CloseIcon: ['./src/icon/CloseIcon.js'],
        Collapse: ['./src/collapse/Collapse.js'],
        CollapseGroup: ['./src/collapse/CollapseGroup.js'],
        CollapsiblePanel: ['./src/panel/CollapsiblePanel.js'],
        ColorLabel: ['./src/colorLabel/index.js'],
        ConvenientDropdown: ['./src/dropdown/ConvenientDropdown.js'],
        DateTimePicker: ['./src/datepicker/DateTimePicker.js'],
        DateTimeRangePicker: ['./src/datepicker/DateTimeRangePicker.js'],
        Dropdown: ['./src/dropdown/Dropdown.js'],
        Fieldset: ['./src/forms/Fieldset.js'],
        FileUpload: ['./src/forms/FileUpload.js'],
        FormActions: ['./src/forms/FormActions.js'],
        FormControls: ['./src/forms/FormControls.js'],
        FormGroup: ['./src/forms/FormGroup.js'],
        FormPanel: ['./src/panel/FormPanel.js'],
        Glyphicon: ['./src/glyphicon/Glyphicon.js'],
        GroupBody: ['./src/collapse/GroupBody.js'],
        GroupHeader: ['./src/collapse/GroupHeader.js'],
        HelpText: ['./src/forms/HelpText.js'],
        Icon: ['./src/icon/Icon.js'],
        IconButton: ['./src/button/IconButton.js'],
        InputGroup: ['./src/forms/InputGroup.js'],
        Label: ['./src/forms/Label.js'],
        LabeledButton: ['./src/button/LabeledButton.js'],
        LabeledGroup: ['./src/forms/labeledLayout/LabeledGroup.js'],
        LabeledLayout: ['./src/forms/labeledLayout/LabeledLayout.js'],
        LabeledRow: ['./src/forms/labeledLayout/LabeledRow.js'],
        LabelField: ['./src/forms/LabelField.js'],
        LayoutHelper: ['./src/forms/LayoutHelper.js'],
        Loader: ['./src/loader/Loader.js'],
        Mask: ['./src/mask/Mask.js'],
        MediaObject: ['./src/mediaObject/index.js'],
        Menu: ['./src/menu/Menu.js'],
        MenuItem: ['./src/menu/MenuItem.js'],
        Modal: ['./src/modal/index.js'],
        MultipleSelection: ['./src/forms/multipleSelection/MultipleSelection.js'],
        MultipleSelectionMenu: ['./src/forms/multipleSelection/MultipleSelectionMenu.js'],
        NavBar: ['./src/navbar/index.js'],
        Navs: ['./src/navs/index.js'],
        Panel: ['./src/panel/Panel.js'],
        Portal: ['./src/portal/Portal.js'],
        ProductLogo: ['./src/productLogo/ProductLogo.js'],
        QueryBuilder: ['./src/queryBuilder/index.js'],
        Radio: ['./src/forms/Radio.js'],
        RadioGroup: ['./src/forms/RadioGroup.js'],
        SearchBox: ['./src/forms/searchBox/index.js'],
        Select: ['./src/forms/Select.js'],
        SimpleTable: ['./src/simpleTable/Table.js'],
        TextField: ['./src/forms/TextField.js'],
        TmAgGrid: ['./src/tmAgGrid/TmAgGrid.js'],
        TmIcon: ['./src/icon/TmIcon.js'],
        TmTooltip: ['./src/tooltip/TmTooltip.js'],
        TooltipHelper: ['./src/tooltip/TooltipHelper.js'],
        TreeDropdown: ['./src/dropdown/TreeDropdown.js'],
        toastModalWrapper: ['./src/hocs/modal/toastWrapper'],
        actionsModalWrapper: ['./src/hocs/modal/actionsWrapper']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            basic,
        ]
    },
    externals: [
        {
            'react': {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            }
        },
        {
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            }
        },
        {
            'react-datagrid': {
                root: 'DataGrid',
                commonjs2: 'react-datagrid',
                commonjs: 'react-datagrid',
                amd: 'react-datagrid'
            }
        },
        {
            'react-datetime': {
                root: 'Datetime',
                commonjs2: 'react-datetime',
                commonjs: 'react-datetime',
                amd: 'react-datetime'
            }
        },
        {
            'classnames': {
                root: 'classNames',
                commonjs2: 'classnames',
                commonjs: 'classnames',
                amd: 'classnames'
            }
        },
        {
            'lodash': {
                root: '_',
                commonjs2: 'lodash',
                commonjs: 'lodash',
                amd: 'lodash'
            }
        }
    ]
};
