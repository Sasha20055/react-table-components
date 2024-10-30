import clsx from "clsx";
import cls from "../DataTable.module.css";
import {Button, Col, Form, Row, Tab, Tabs} from "react-bootstrap";
import AlertCenter from "../../../AlertCenter";
import ColumnsSelector from "../../ColumnsSelector/ColumnsSelector";
import ExportImport from "../../../control-panel/export-import/ExportImport";
import LocalStorageService from "../../../../services/LocalStorageService";
import React from "react";

const TableTitle = ({ filterTabs, title }) => {
    const rowClassName = clsx(cls.title, cls.headerTitleRow);
    const colClassName = clsx('text-center', cls.title);

    return (
        <>
            {filterTabs && (
                <Row className={rowClassName}>
                    {title}
                </Row>
            )}
            {!filterTabs && (
                <Col className={colClassName}>
                    {title}
                </Col>
            )}
        </>
    );
};

const TableAlerts = ({ dataTableNotifications, featuresProps, alertClickHandler, alertItemTitle }) => {
    const hasNotifications = dataTableNotifications?.length > 0 && featuresProps?.showAlertCenter !== false;

    return hasNotifications && (
        <Col className="col-auto text-right">
            <AlertCenter alerts={dataTableNotifications} onClick={alertClickHandler} item={alertItemTitle} />
        </Col>
    );
};

const TableSearch = ({ featuresState, onSearch, search }) => {
    return featuresState.search !== false && (
        <Form.Control
            size="sm"
            type="text"
            name="search"
            autoComplete="off"
            className={cls.search}
            placeholder="поиск..."
            onChange={onSearch}
            value={search}
        />
    );
};

const TableColumnsSelector = ({ featuresState, title, onSortColumns, columnsProps, notify }) => {
    return featuresState.canChooseColumns && (
        <ColumnsSelector
            title={title}
            onSort={onSortColumns}
            columns={columnsProps}
            notify={notify}
        />
    );
};

const TableExportImport = ({ featuresState, setXlsExportStatuses, setXlsExportInterval, exportToExcel, getQuoteStatuses }) => {
    return featuresState.xls && (
        <ExportImport
            noInitialPolling
            isDownloadXls={false}
            xlsExportStatuses={[]}
            onChangeXlsExportStatuses={ (xlsExportStatuses => setXlsExportStatuses(xlsExportStatuses)) }
            getQuoteStatuses={getQuoteStatuses}
            onChangeXlsExportInterval={xlsExportInterval => setXlsExportInterval(xlsExportInterval)}
            type={ExportImport.DATATABLE_XLS_EXPORT}
            handlerExport={exportToExcel}
        />
    );
};

const TableAddButton = ({ featuresState, openAddForm }) => {
    return featuresState.canAdd !== false && openAddForm && (
        <Button variant="outline-primary" size="sm" onClick={openAddForm}>
            Добавить
        </Button>
    );
};

const TableClearFiltersButton = ({ clearFilters }) => {
    return (
        <Button variant="link" size="sm" className={cls.link} onClick={clearFilters}>
            очистить фильтры
        </Button>
    );
};

const TableFilterTabs = ( {title, filterTabs, load, activeFilterTab, onChangeFilterTabs, loading } ) => {

    const defaultActiveKey = LocalStorageService.extract(title, 'activeFilterTab') || filterTabs[0]?.key;

    const tabsClassName = clsx('m-0', 'text-left', cls.filterTabs)

    return (
        <div className={cls.filterTabsContainer}>
            <Button
                style={{ height: "33px" }}
                variant="outline-primary"
                size="sm"
                onClick={() => load(true, true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                     className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
            </Button>

            <Tabs
                defaultActiveKey={defaultActiveKey}
                activeKey={activeFilterTab}
                className={tabsClassName}
                onSelect={key => onChangeFilterTabs(key)}
            >
                {filterTabs.map(tab => (
                    <Tab
                        disabled={loading}
                        eventKey={tab.key}
                        title={tab.title}
                    />
                ))}
            </Tabs>
        </div>
    );
}

export { TableClearFiltersButton, TableFilterTabs, TableSearch, TableTitle, TableAlerts, TableAddButton, TableColumnsSelector, TableExportImport }