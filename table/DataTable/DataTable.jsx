import React from "react";
import {createStore} from 'redux';
import { connect } from 'react-redux';
import localStorageService from "../../../services/LocalStorageService";
import reducer from '../reducer';
import './DataTable.css';
import LocalStorageService from "../../../services/LocalStorageService";
import DataTableInner from "./DataTableInner";

class DataTable extends React.PureComponent {
	static get STRING_FILTER() { return 'string'; }
	static get DICTIONARY_FILTER() { return 'dictionary'; }
	static get NUMERIC_RANGE_FILTER() { return 'numeric_range'; }
	static get DATE_RANGE_FILTER() { return 'date_range'; }
	static get INSTANT_DATE_RANGE_FILTER() { return 'instant_date_range'; }
	static get BOOLEAN_FILTER() { return 'boolean'; }
	static get ROLES_FILTER() { return 'roles'; }
	static get ENUM_FILTER() { return 'enum'; }
	static get USER_FILTER() { return 'user'; }
	static get DEPARTMENTS_FILTER() { return 'departments'; }
	static get ADDRESS_FILTER() { return 'address'; }

	static sortColumns(title, columns) {
		if (!columns) {
			return columns;
		}
		const sorted = localStorageService.extract(title, 'sortOrder');
		if (!sorted) {
			return columns;
		}
		const mapByField = columns.reduce((map, column) => {
			map[column.field] = column;
			return map;
		}, {});

		return sorted.map(it => mapByField[it]);
	}

	static mapStateToProps(state, ownProps) {
		const storedPropProvider = (prop, defaultProvider) => localStorageService.extract(ownProps.title,
					`${LocalStorageService.extract(ownProps.title, 'activeFilterTab')}_${prop}`)
				|| state[prop]
				|| localStorageService.extract(ownProps.title, prop, LocalStorageService.extract(ownProps.title, 'activeFilterTab') || ownProps[prop])
				|| (defaultProvider ? defaultProvider() : null),
			hiddenColumnsProvider = () =>
				ownProps.columns?.filter(col => col.hidden).map(col => col.key || col.field);
		return {
			sort: storedPropProvider('sort'),
			search: storedPropProvider('search', () => ''),
			filter: storedPropProvider('filter'),
			page: storedPropProvider('page', () => 0),
			showFilter: !!state.filterConfig,
			hiddenColumns: storedPropProvider('hiddenColumns', hiddenColumnsProvider),
			columns: DataTable.sortColumns(ownProps.title, ownProps.columns)
		};
	}

	render() {
		const initialState = () => {
			const {title, storageTitle, filter, sort, page, search} = this.props;
			return {
				title: storageTitle || title,
				filter, sort, page, search
			};
		};
		return <DataTableInnerConnected {...this.props} store={createStore(reducer(initialState()))}/>
	}
}

const DataTableInnerConnected = connect(DataTable.mapStateToProps)(DataTableInner);
export default connect(DataTable.mapStateToProps)(DataTable);
