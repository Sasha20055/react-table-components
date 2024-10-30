import React, { useState, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import localStorageService from "../../../services/LocalStorageService";
import SelectorItem from "./SelectorItem";

import '../DataTable/DataTable.css';
import cls from "./ColumnsSelector.module.css"

import {
	DATA_TABLE_HIDE_COLUMNS,
	DATA_TABLE_SORT_COLUMNS,
} from "../../../actions/types";

export default function ColumnsSelector({title, columns, notify, onSort}) {
	const defaultHiddenColumns = () => columns.filter(col => col.hidden).map(col => col.key || col.field);

	const [menuOpen, setMenuOpen] = useState(false);
	const [hover, setHover] = useState('');
	const [hiddenColumns, setHiddenColumns] = useState([]);
	const isColumnHidden = key => hiddenColumns.indexOf(key) >= 0;
	let forceOpen = false;

	useEffect(() => {
		const savedHiddenColumns = localStorageService.extract(title, 'hiddenColumns', null);
		setHiddenColumns(savedHiddenColumns || defaultHiddenColumns(columns));
	}, [title, columns]);

	const onSortItems = (item, beforItem) => {
		setHover('');
		onSort(item, beforItem);
		notify(DATA_TABLE_SORT_COLUMNS);
	}

	const onSelect = key => {
		const index = hiddenColumns.indexOf(key);
		let updated;
		if (index < 0) {
			updated = hiddenColumns.concat(key);
		} else {
			updated = [...hiddenColumns];
			updated.splice(index, 1);
		}
		setHiddenColumns(updated);
		localStorageService.updateObject(title, 'hiddenColumns', updated);
		notify(DATA_TABLE_HIDE_COLUMNS);
	}

	const dropdownToggle = newValue => {
	    if (forceOpen){
			setMenuOpen(true);
	        forceOpen = false;
	    } else {
			setMenuOpen(newValue);
	    }
	}

	const menuItemClickedThatShouldntCloseDropdown = () => {
	    forceOpen = true;
	};

	return (
		<NavDropdown id={'columns-selector-' + title} title="колонки" className={cls.columnsSelector} onSelect={it => onSelect(it)}
				show={menuOpen}  onToggle={val => dropdownToggle(val)}>
			<DndProvider backend={HTML5Backend}>
				{columns.filter(col => col.title && (col.key || col.field)).map(col => {
					const key = col.key || col.field;
					const hidden = isColumnHidden(key);
					return (
						<SelectorItem eventKey={key} title={col.title} field={col.field} key={key} hidden={hidden}
									  onClick={() => menuItemClickedThatShouldntCloseDropdown()}
									  onSort={onSortItems} hover={hover} setHover={setHover}
						>
						</SelectorItem>
					)}
				)}
			</DndProvider>
		</NavDropdown>
	);
}