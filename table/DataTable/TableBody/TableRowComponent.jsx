import React, {useState} from "react";
import clsx from "clsx";
import cls from "../DataTable.module.css";
import TableContextMenu from "./TableContextMenu";

const TableRowComponent = (props) => {

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuActiveRow, setMenuActiveRow] = useState(null)

    const {
        row,
        index,
        features,
        dataTableAlerts,
        contextMenuObj,
        openEditForm,
        selectedRowId,
        columns,
        onSelectRow,
        isColumnHidden,
    } = props;

    const renderTableCell = (row, col) => {
        const value = row[col.field];
        if (typeof value === "object" && !Array.isArray(value)) {
            return renderObject(col, row);
        }
        return renderPrimitive(col, row);
    };

    const renderPrimitive = (col, row, value) => {
        const valueSafe = value ?? row[col.field];
        return col.formatter ? col.formatter(valueSafe, row) : valueSafe;
    };

    const renderObject = (col, row) => {
        const value = row[col.field];
        const isDictionary = value && (value.id === 0 || value.id) && value.value;
        if (isDictionary || isDictionary === "") {
            return renderPrimitive(col, row, value.value);
        }
        return renderPrimitive(col, row);
    };

    const handleContextMenu = (event, row) => {
        event.preventDefault();
        setMenuPosition({x: event.pageX - 240, y: event.pageY - 95})
        setMenuVisible(true)
        setMenuActiveRow(row)
    };

    const isShowAlert = features?.showAlertCenter !== false && dataTableAlerts?.some(a => a.id === row.id);
    const isSelectedRow = selectedRowId === row.id;

    const rowClassName = clsx({
        "alert-color": isShowAlert,
        [cls.selectRow]: isSelectedRow
    });

    const getTableContextMenuProps = () => {
        return {
            contextMenuObj,
            menuVisible,
            menuPosition,
            menuActiveRow,
            setMenuActiveRow: setMenuActiveRow,
            setMenuVisible: setMenuVisible,
            setMenuPosition: setMenuPosition
        }
    }

    return (
        <React.Fragment>
            <TableContextMenu {...getTableContextMenuProps()} />
            <tr onContextMenu={contextMenuObj ? (event => handleContextMenu(event, row)) : null}
                key={index}
                onClick={() => onSelectRow(row.id)}
                onDoubleClick={() => openEditForm?.(row)}
                className={rowClassName}>
                {columns.map(col => {
                    const key = col.key || col.field;
                    const className = typeof col.className === "function" ? col.className(row) : col.className;
                    return !isColumnHidden(key) ? (
                        <td key={`${key}-${index}`} className={className}>
                            {renderTableCell(row, col)}
                        </td>
                    ) : null;
                })}
            </tr>
        </React.Fragment>
    );
};

export default TableRowComponent