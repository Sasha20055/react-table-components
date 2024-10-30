import React from "react";
import LocalStorageService from "../../../services/LocalStorageService";
import clsx from "clsx";
import cls from "./DataTable.module.css";
import {
    DATA_TABLE_FILTER
} from "../../../actions/types";
import localStorageService from "../../../services/LocalStorageService";
import Util from "../../../utils/util/Util";
import {Card, Table} from "react-bootstrap";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import Filter from "../Filter/Filter";
import TableHeader from "./TableHeader/TableHeader";
import ReactDOM from "react-dom";
import ColumnResizer from "column-resizer";
import TableControlPanel from "./TableControlPanel/TableControlPanel";
import TableFooter from "./TableFooter/TableFooter";
import TableBody from "./TableBody/TableBody";

export default class DataTableInner extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            pageSize: localStorage.getItem("pageSize") || 10,
            pages: 0,
            resizer: undefined,
            selectedRowId: null,
            showPageSizeMenu: false,
            prevParams: {},
            prevFilterTab: null,
            columns: []
        };

        this.features = {canChooseColumns: true, ...props.features};

        this.dataTableCard = React.createRef();
        this.pageSizeMenu = React.createRef();
        this.dataTable = React.createRef();
    }

    // Props to other components -------------------

    getTableControlPanelProps = () => {
        return {
            ...this.props,
            activeFilterTab: this.state.activeFilterTab,
            setActiveFilterTab: ( activeFilterTab => this.setState({ activeFilterTab }) ),
            setPages: ( pages => this.setState({ pages }) ),
            loading: this.state.loading,
            columnsProps: this.props.columns,
            columnsState: this.state.columns,
            setSortedColumns: this.setSortedColumns,
            isFilterDataInHistory: this.isFilterDataInHistory,
            data: this.state.data,
            load: ( (showLoading, forseUpdate) => this.load(showLoading, forseUpdate) ),
            isFiltered: this.state.isFiltered,
            featuresState: this.features,
            featuresProps: this.props.features,
        }
    };

    getTableFooterProps = () => {
        return {
            ...this.props,
            showPageSizeMenu: this.state.showPageSizeMenu,
            onShowPageSizeMenu: ((showPageSizeMenu) => this.setState({ showPageSizeMenu })),
            totalPages: this.state.pages,
            pageSize: this.state.pageSize,
            hidePageSizeOptions: this.features.hidePageSizeOptions,
            fetch: ( (params) => this.fetch(params) ),
            getFilter: this.getFilter,
            getFilterTabsValue: this.getFilterTabsValue,
            setData: ( (data, pages, pageSize) => {
                this.setState({
                    data,
                    pages,
                    pageSize,
                    loading: false
                })} )
        }
    }

    getTableHeaderProps = (col, index) => {
        return {
            ...this.props,
            key: col.id,
            isColumnHidden: ( key => this.isColumnHidden(key) ),
            col: col,
            id: col.title,
            index: index,
            columns: this.state.columns,
            setColumns: ( columns => this.setState({ columns }) )
        };
    }

    getTableBodyProps = () => {
        return {
            ...this.props,
            data: this.state.data,
            getFilterTabsKey: this.getFilterTabsKey,
            selectedRowId: this.state.selectedRowId,
            columns: this.state.columns,
            onSelectRow: ( (selectedRowId) => this.setState({selectedRowId}) ),
            isColumnHidden: ( (key) => this.isColumnHidden(key) )
        }
    }

    fetch(params) {
        return this.props.fetch ? this.props.fetch(params) : Promise.resolve({data: [], pages: 0});
    }

    // filter methods ------------------------------

    isFilterDataInHistory = () => {
        const activeFilterTab = this.getFilterTabsKey()
        return this.state.data.findIndex(dat => dat?.filter === activeFilterTab)
    }

    setDataInDT = (data) => {
        let newData;

        if (this.props.filterTabs) {
            const activeFilterTab = this.getFilterTabsKey();
            const dataFilterIndex = this.isFilterDataInHistory();

            newData = dataFilterIndex === -1
                ? [
                    ...this.state.data.filter(row => row.filter),
                    { filter: activeFilterTab, data: [...data], pages: this.state.pages }
                ]
                : [...this.state.data];

            if (dataFilterIndex !== -1) {
                newData[dataFilterIndex].data = [...data];
            }
        } else {
            newData = [...data];
        }

        this.setState({ data: newData });
    }

    async updateIsFiltered() {
        const filter = await this.getFilter();
        const isFiltered = Object.keys(filter).length > 0;
        this.setState({isFiltered});
    }

    getIsEqualParams = (forseUpdate, params) => {
        const isEqualParams = JSON.stringify(this.state.prevParams) !== JSON.stringify(params);
        const isEqualTab = this.props.filterTabs ? this.state.activeFilterTab === this.getFilterTabsKey() : true;

        return forseUpdate || (isEqualParams && isEqualTab);
    }

    getFilter = async () => {
        const { filter } = this.props;

        if (!filter) {
            return {};
        }

        return Object.entries(filter)
            .filter(([, value]) => !!value)
            .reduce((acc, [, value]) => ({ ...acc, ...value }), {});
    }

    getFilterTabsKey = () => {
        const { filterTabs, title } = this.props;

        if (!filterTabs) {
            return null;
        }

        const activeTab = LocalStorageService.extract(title, 'activeFilterTab');
        return activeTab || filterTabs[0]?.key;
    }

    getFilterTabsValue = () => {
        const key = this.getFilterTabsKey()
        return this.props.filterTabs?.find(value => value.key === key)?.value
    }

    render() {
        const cardClassName = clsx("data-table", this.props.className, cls.dataTable)

        return (
            <DndProvider backend={HTML5Backend}>
                <Card
                    className={cardClassName}
                    onCopy={this.disableEvent}
                    onCut={this.disableEvent}
                >
                    <Card.Header className={cls.cardHeader}>
                        <TableControlPanel {...this.getTableControlPanelProps()} />
                    </Card.Header>
                    <Card.Body
                        ref={this.dataTableCard}
                        className={cls.cardBody}
                        style={{ maxHeight: this.props.style?.maxHeight }}
                    >
                        {this.props.showFilter && <Filter store={this.props.store}/>}
                        {this.renderTable()}
                    </Card.Body>
                    <TableFooter {...this.getTableFooterProps()} />
                </Card>
            </DndProvider>
        );
    }

    renderTable() {
        const { sumWidth } = this.state;
        const tableStyle = sumWidth ? { minWidth: sumWidth } : {};

        const tableClassName = clsx(this.props?.tableClassName, cls.table)

        return (
            <Table
                key={this.props.key || this.props.title}
                striped
                bordered
                hover
                size="sm"
                ref={this.dataTable}
                style={tableStyle}
                id="data-table-id"
                className={tableClassName}
            >
                <thead>
                <tr>
                    {this.state.columns.map((col, index) =>
                        <TableHeader {...this.getTableHeaderProps(col, index)} />
                    )}
                </tr>
                </thead>
                <tbody>
                <TableBody {...this.getTableBodyProps()} />
                </tbody>
            </Table>
        );
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    async load(showLoading, forseUpdate) {
        const { search, page, sort, filterTabs, defaultFilterParam } = this.props;
        const { pageSize } = this.state;

        if (showLoading) this.setLoading(true);

        const params = {
            search, page,
            pageSize, sort,
            ...await this.getFilter(),
            ...(filterTabs && { [defaultFilterParam]: this.getFilterTabsValue() })
        };

        const isEqualParams = this.getIsEqualParams(forseUpdate, params);

        if (isEqualParams || !filterTabs) {
            const fetchResponse = await this.fetch(params);
            this.setState({
                pages: fetchResponse.pages,
                loading: false,
                prevParams: params
            }, () => {
                this.setDataInDT(fetchResponse.data);
                this.updateIsFiltered();
            });
        }

        if (filterTabs) {
            this.setState({ activeFilterTab: this.getFilterTabsKey() });
        }

        if (!isEqualParams) this.setLoading(false);
    }

    async componentDidMount() {
        const { filterTabs, columns, resizable } = this.props;

        if (filterTabs) {
            this.setState({ activeFilterTab: this.getFilterTabsKey() });
        }

        this.setColumnsSizes();
        const sortedColumns = this.getSortedColumns(columns || []);
        this.setState({ columns: sortedColumns });

        await this.load(true, true);

        if (resizable) {
            this.enableResize();
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { title, filterTabs, resizable, specialFilter } = this.props;

        if (prevProps.title !== title) {
            if (filterTabs) {
                this.setState({ activeFilterTab: this.getFilterTabsKey() });
            }
            this.load(true).then(() => {
                this.setSortedColumns();
                this.setColumnsSizes();
                this.setState({ data: [] });
            });
        }

        const doReload =
            prevProps.filter !== this.props.filter ||
            prevProps.sort !== this.props.sort ||
            prevProps.page !== this.props.page ||
            prevProps.search !== this.props.search;

        if (doReload) {
            await this.load(true);
        }

        if (resizable) {
            const { resizer } = this.state;
            if (resizer) {
                resizer.reset({ disable: true });
            }
            this.enableResize();
        }

        if (snapshot !== null) {
            const dataTableCard = this.dataTableCard.current;
            dataTableCard.scrollLeft = snapshot.scrollLeft;
        }

        if (!Util.deepEquals(prevProps.specialFilter, specialFilter)) {
            specialFilter.forEach(it =>
                this.props.dispatch({ type: DATA_TABLE_FILTER, payload: it })
            );
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        // save scroll position
        const dataTableCard = this.dataTableCard.current;
        return {
            scrollWidth: dataTableCard.scrollWidth,
            scrollLeft: dataTableCard.scrollLeft
        };
    }

    // columns methods ---------------------------------

    isColumnHidden = (key) => {
        return this.props.hiddenColumns && this.props.hiddenColumns.indexOf(key) >= 0;
    }

    getSortedColumns = (columns) => {
        const order = localStorageService.extract(this.props.title, 'columnsOrder');
        const sortedColumns = columns.filter(column => !this.isColumnHidden(column.key || column.field));

        if(order) {
            const orderMap = order.reduce((acc, item, index) => {
                acc[item] = index;
                return acc;
            }, {});
            return sortedColumns.sort((a, b) => orderMap[a.title] - orderMap[b.title]);
        }

        return sortedColumns;
    }

    setSortedColumns = () => {
        const sortedColumns = this.getSortedColumns(this.props.columns)
        this.setState({columns: sortedColumns })
    }

    visibleColumnsSumWidth = () => {
        let sum = 0;
        const columnsWidth = localStorageService.extract(this.props.title, "columnsWidth")

        this.getSortedColumns(this.props.columns).map((col, index) => {
            const key = col.key || col.field;
            !this.isColumnHidden(key) && (sum += columnsWidth[index])
        })

        return sum
    }

    setColumnsSizes = () => {
        const columnsWidth = localStorageService.extract(this.props.title, "columnsWidth")
        if(columnsWidth) {
            this.setState({
                columnsWidth: columnsWidth,
                sumWidth: this.visibleColumnsSumWidth()})
        }
    }

    // drag and drop methods ----------------------------

    disableEvent(e) {
        e.preventDefault()
        return false;
    }

    handleResize = (event) => {
        const columnsWidth = this.state.columns
            .filter(col => col.field)
            .map(col => {
                const docCol = document.querySelector(`table .${col.field}`);
                return docCol ? docCol.offsetWidth : 0;
            });

        localStorageService.updateObject(this.props.title, "columnsWidth", columnsWidth);
    }

    handleOnResize = (event) => {
        if(this.state.columnsWidth) {
            this.setState({columnsWidth: null})
        }
    }


    enableResize() {
        const options = {
            resizeMode: "overflow",
            liveDrag: true,
            draggingClass: "rangeDrag",
            onDrag: this.handleOnResize,
            onResize: this.handleResize,
            widths: [...this.state.columnsWidth || []]
        };
        this.state.resizer = new ColumnResizer(ReactDOM.findDOMNode(this).querySelector("#data-table-id"), options);
    }
}