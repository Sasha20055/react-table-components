import React from 'react';
import TableRowComponent from "./TableRowComponent";

const TableBody = (props) => {

    const {
        data,
        features,
        dataTableAlerts,
        contextMenuObj,
        openEditForm,
        selectedRowId,
        columns,
        onSelectRow,
        onContextMenu,
        isColumnHidden,
        getFilterTabsKey
    } = props;

    let index = 0;

    const getTableRowProps = (row) => {
        return {
            key: index,
            row: row,
            index: index++,
            features: features,
            dataTableAlerts: dataTableAlerts,
            contextMenuObj: contextMenuObj,
            openEditForm: openEditForm,
            selectedRowId: selectedRowId,
            columns: columns,
            onSelectRow: onSelectRow,
            onContextMenu: onContextMenu,
            isColumnHidden: isColumnHidden
        };
    }

    return data.flatMap(row => {
        if (!row.filter) {
            return row.id ? (
                <TableRowComponent {...getTableRowProps(row)} />
            ) : null;
        }
        if (row.filter === getFilterTabsKey()) {
            return row.data.map(tabFilterRow => (
                <TableRowComponent {...getTableRowProps(tabFilterRow)} />
            ));
        }
        return null;
    }).filter(Boolean);
};

export default TableBody;