import React from "react";
import { connect } from 'react-redux';

import Filter from './Filter/Filter';
import DataTable from './DataTable/DataTable';

import {
	DATA_TABLE_SORT,
	DATA_TABLE_FILTER,
	DATA_TABLE_SHOW_FILTER
} from "../../actions/types";
import localStorageService from "../../services/LocalStorageService";
import cls from "./DataTable/DataTable.module.css"
import clsx from "clsx";

function mapStateToProps(state, ownProps) {
	return {
		sort: state.sort || ownProps.sort,
		filter: state.filter?.[ownProps.field],
		filterConfig: state.filterConfig
	};
}
class ThSortable extends React.PureComponent {
	constructor(props) {
		super(props);
		this.th = React.createRef();
	}
	
	onClick() {
		if (!this.isSortable()) {
			return;
		}
		const field = this.props.field, 
			dir = this.props.sort && field === this.props.sort.field 
				&& this.props.sort.dir === "asc" ? "desc" : "asc";
		this.props.dispatch({type: DATA_TABLE_SORT, payload: {field, dir}});
	}
	
	isSortable() {
		return this.props.sortable !== false;
	}

	onShowFilter(e) {
		e.stopPropagation();
		
		const pos = this.props.filterConfig?.pos ? 
					null : this.calculateFilterPosition(),
				field = this.props.field,
				title = this.props.title,
				activeOnly = this.props.activeOnly !== false,
				payload = {type: this.props.filterType, field, pos, title, activeOnly};

		switch (this.props.filterType) {
			case DataTable.DICTIONARY_FILTER:
				payload.multiSelect = this.props.multiSelect;
				payload.filteredOptions = this.props.filteredOptions;
				payload.optionsType = this.props.optionsType;
				break;
			case DataTable.TASK_FILTER:
				payload.selectType = this.props.selectType;
				payload.filteredOptions = this.props.filteredOptions;
				payload.optionsType = this.props.optionsType;
				payload.multiSelect = this.props.multiSelect;
				break;
			case DataTable.ENUM_FILTER:
				payload.filteredOptions = this.props.filteredOptions;
				payload.optionsType = this.props.optionsType;
				payload.multiSelect = this.props.multiSelect;
				break;
			case DataTable.ROLES_FILTER:
				payload.filteredOptions = this.props.filteredOptions;
				break;
			case DataTable.USER_FILTER:
				payload.role = this.props.role;
				break;
		}

		this.props.dispatch({type: DATA_TABLE_SHOW_FILTER, payload});
	}
	
	onClearFilter(e) {
		e.stopPropagation();
		this.props.dispatch({
			type: DATA_TABLE_FILTER, 
			payload: {
				field: this.props.field,
				value: '',
				updateFilter: true
			}
		});
	}
		
	calculateFilterPosition() {
		const cellRect = this.th.current.getBoundingClientRect(),
			tableRect = this.th.current.closest('table').getBoundingClientRect(),
			pos = {top: cellRect.y + cellRect.height},
			right = cellRect.x + cellRect.width;
			
		if (right - Filter.RECT.W >= tableRect.x) {
			pos.right = right;
		} else {
			pos.left = cellRect.x;
		}
		return pos;
	}
	
	isSortedBy(dir) {
		return this.props.sort && this.props.field === this.props.sort.field && this.props.sort.dir === dir
	}

	isFiltered() {
		if (!this.props.filter) {
			return false;
		}
		return Object.keys(this.props.filter)
			.map(key => this.props.filter[key])
			.find(value => value !== undefined && value !== null && value !== '');	
	}
	
	render() {
		const thProps = {};
		if (this.props.colSpan) {
			thProps.colSpan = this.props.colSpan;
		}
		if (this.props.rowSpan) {
			thProps.rowSpan = this.props.rowSpan;
		}
		if (this.props.className) {
			thProps.className = this.props.className;
		}
		if (this.isSortable()) {
			thProps.className = (thProps.className || "") + ` sortable ${cls.sortable}`;
		}
			
		const isFiltered = this.isFiltered()

		const filterIconsClass = clsx("fas", "fa-fw", cls.faFilter, {[cls.sortable] : isFiltered})
		const clearIconsClass = clsx("fas", "fa-fw", "fa-times", cls.faTimes);

		return (
				<div {...thProps} onClick={this.onClick.bind(this)} ref={this.th} className={cls.thContainer}>
					<span className={cls.thTitle}>
						{this.props.title}
						{this.isSortedBy('asc') && <i className="fas fa-fw fa-arrow-up" />}
						{this.isSortedBy('desc') && <i className="fas fa-fw fa-arrow-down" />}
					</span>
					{!!this.props.filterType && <i className={filterIconsClass}
						onClick={this.onShowFilter.bind(this)} />}
					{isFiltered && <i className={clearIconsClass}
						onClick={this.onClearFilter.bind(this)} />}
				</div>
		);
	}
}
export default connect(mapStateToProps)(ThSortable);
