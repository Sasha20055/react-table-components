import React, {useState} from 'react';
import clsx from 'clsx';
import {Container, Row, Col} from 'react-bootstrap';
import cls from "../DataTable.module.css"
import LocalStorageService from "../../../../services/LocalStorageService";
import {
    DATA_TABLE_CLEAR_FILTERS,
    DATA_TABLE_FILTER,
    DATA_TABLE_HIDE_COLUMNS,
    DATA_TABLE_SEARCH,
    DATA_TABLE_SORT_COLUMNS
} from "../../../../actions/types";
import localStorageService from "../../../../services/LocalStorageService";
import Util from "../../../../utils/util/Util";
import {
    TableAddButton,
    TableAlerts,
    TableClearFiltersButton, TableColumnsSelector, TableExportImport,
    TableFilterTabs,
    TableSearch,
    TableTitle
} from "./TableControlPanelRenders";


const TableControlPanel = (props) => {

    const [xlsExportInterval, setXlsExportInterval] = useState(null);
    const [xlsExportStatuses, setXlsExportStatuses] = useState(null);
    const [isDownloadXls, setIsDownloadXls] = useState(false);

    const {
        title,
        filterTabs,
        isFiltered,
        search,
        columnsProps,
        columnsState,
        openAddForm,
        featuresState,
        featuresProps,
        dataTableNotifications,
        alertClickHandler,
        alertItemTitle,
        getQuoteStatuses,
        activeFilterTab,
        loading,
        setColumns,
        setActiveFilterTab,
        setPages,
        load,
        data,
        isFilterDataInHistory,
        setSortedColumns,
        dispatch,
        fetchXLSWithCurrentData
    } = props;

    const clearFilters = () => {
        dispatch({type: DATA_TABLE_CLEAR_FILTERS});
    }

    const onSearch = (e) => {
        dispatch({type: DATA_TABLE_SEARCH, payload: e.target.value});
    }

    const fetchXLS = (params) => {
        return props.fetchXLS
            ? props.fetchXLS(fetchXLSWithCurrentData ? data : params)
            : Promise.resolve({data: [], pages: 0});
    }

    const notify = async (type) => {
        switch (type) {
            case DATA_TABLE_HIDE_COLUMNS:
                await onChangeHiddenColumns(); break;
            case DATA_TABLE_SORT_COLUMNS:
                dispatch({ type: DATA_TABLE_SORT_COLUMNS }); break;
        }
    }

    const onChangeHiddenColumns = async () => {
        const hiddenColumns = localStorageService.extract(title, 'hiddenColumns', null);
        await dispatch({type: DATA_TABLE_HIDE_COLUMNS, payload: hiddenColumns });
        setSortedColumns();
    }

    const onSortColumns = (item, beforeItem) => {
        const stored = localStorageService.extract(title, 'sortOrder') || [];

        const fields = stored.length ? stored : columnsState.map(col => col.field);
        const oldIndex = fields.indexOf(item);
        const newIndex = fields.indexOf(beforeItem);

        if (oldIndex !== -1 && newIndex !== -1) {
            Util.moveItemInArray(fields, oldIndex, newIndex);
            localStorageService.updateObject(title, 'sortOrder', fields);
        }
    }

    const exportToExcel = async () => {
        await setIsDownloadXls(true)
        await fetchXLS({
            search: search,
            createdAt: xlsExportInterval,
            status: xlsExportStatuses || getQuoteStatuses(),
            page: 0,
            pageSize: 2147483647 // Integer.MAX_VALUE
        })
        setIsDownloadXls(false)
    }

    const onChangeFilterTabs = async (key) => {
        LocalStorageService.updateObject(title, 'activeFilterTab', key);

        await setActiveFilterTab(key);
        await setFilter();
        await setColumns();

        const filterDataIndex = isFilterDataInHistory();
        if (filterDataIndex === -1) {
            await load(true, true);
        } else {
            const { pages } = data.find(({ filter }) => filter === key) || {};
            setPages(pages);
        }

        setSortedColumns();
    }

    const setFilter = async () => {
        const filterTab = LocalStorageService.extract(title, 'activeFilterTab')
        const newFilter = LocalStorageService.extract(title, `${filterTab}_filter`)
        newFilter && await dispatch({ type: DATA_TABLE_FILTER, payload: newFilter });
        return newFilter || {}
    }

    const colClassName = clsx('text-right', { 'col-auto': !filterTabs });

    return (
        <Container className={cls.headerContainer}>
            {filterTabs && <TableTitle {...{filterTabs, title}}/>}
            <Row>
                {!filterTabs && <TableTitle {...{filterTabs, title}}/>}
                <TableAlerts {...{ dataTableNotifications, featuresProps, alertClickHandler, alertItemTitle }}/>
                {filterTabs && <TableFilterTabs {...{title, filterTabs, load, activeFilterTab, onChangeFilterTabs, loading }}/>}
                <Col className={colClassName}>
                    {isFiltered && <TableClearFiltersButton {...{ clearFilters }}/>}
                    <TableSearch {...{ featuresState, onSearch, search }}/>
                    <TableColumnsSelector {...{ featuresState, title, onSortColumns, columnsProps, notify }}/>
                    <TableExportImport {...{ featuresState, setXlsExportStatuses, setXlsExportInterval, exportToExcel, getQuoteStatuses }}/>
                    <TableAddButton {...{ featuresState, openAddForm }}/>
                </Col>
            </Row>
        </Container>
    );
};

export default TableControlPanel;