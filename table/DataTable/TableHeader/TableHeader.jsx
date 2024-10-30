import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ThSortable from '../../ThSortable';
import LocalStorageService from "../../../../services/LocalStorageService"; // Убедитесь, что путь правильный

const ItemType = 'COLUMN';

const TableHeader = (props) => {
    const ref = useRef(null);
    const { id, index, col, columns, setColumns, title } = props;

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveColumn(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const moveColumn = (fromIndex, toIndex) => {
        const updatedColumns = [...columns];

        const [movedColumn] = updatedColumns.splice(fromIndex, 1);
        updatedColumns.splice(toIndex, 0, movedColumn);

        setColumns(updatedColumns)

        LocalStorageService.updateObject(title, 'columnsOrder', updatedColumns.map(col => col.title));
    }

    const [, drag] = useDrag({
        type: ItemType,
        item: { id, index },
    });

    drag(drop(ref));

    if (props.tableHeaderRenderer) {
        return props.tableHeaderRenderer.apply(this);
    }

    const key = col.key || col.field;

    return (
        props.isColumnHidden(key) ? null : (
            <th ref={ref} className={col.className ? col.className + ` ${col.field}` : col.field}>
                <ThSortable
                    store={props.store}
                    key={key}
                    sort={props.sort}
                    field={key}
                    sortable={col.sortable}
                    filterType={col.filter}
                    optionsType={col.optionsType}
                    selectType={col.selectType}
                    multiSelect={col.multiSelect}
                    filteredOptions={col.filteredOptions}
                    role={col.role}
                    activeOnly={col.activeOnly}
                    filter={props.filter}
                    title={col.title}
                />
            </th>
        )
    );
};

export default TableHeader;