import LocalStorageService from "../../services/LocalStorageService";
import {
	DATA_TABLE_SORT,
	DATA_TABLE_PAGE,
	DATA_TABLE_SEARCH,
	DATA_TABLE_SHOW_FILTER,
	DATA_TABLE_FILTER,
	DATA_TABLE_CLEAR_FILTERS,
	DATA_TABLE_HIDE_COLUMNS,
	DATA_TABLE_SORT_COLUMNS
} from "../../actions/types";

export default (initialState) => 
	(state = {sort: {}, page: 0, filter: {}, ...initialState}, action) => {
	const { type, payload } = action;

	switch (type) {
		case DATA_TABLE_SORT:
			LocalStorageService.updateObject(state.title, 'sort', payload, LocalStorageService.extract(state.title, 'activeFilterTab'));
			return {
				...state,
				sort: {...payload}
			};
		case DATA_TABLE_PAGE:
			LocalStorageService.updateObject(state.title, 'page', payload, LocalStorageService.extract(state.title, 'activeFilterTab'));
			return {
				...state,
				page: payload
			};
		case DATA_TABLE_SEARCH:
			LocalStorageService.updateObject(state.title, 'page', 0, LocalStorageService.extract(state.title, 'activeFilterTab'));
			return {
				...state,
				page: 0,
				search: payload
			};
		case DATA_TABLE_SHOW_FILTER:
			return {
				...state,
				filterConfig: payload ? {...payload} : null
			};
		case DATA_TABLE_FILTER:
			let filter
			if(payload.updateFilter) {
				filter = {
					...state.filter,
					[payload.field]: payload.value
				};
				LocalStorageService.updateObject(state.title, 'filter', filter, LocalStorageService.extract(state.title, 'activeFilterTab'));
				LocalStorageService.updateObject(state.title, 'page', 0, LocalStorageService.extract(state.title, 'activeFilterTab'));
			} else {
				filter = payload
			}
			return {
				...state,
				page: 0,
				filter: filter
			};
		case DATA_TABLE_CLEAR_FILTERS:
			LocalStorageService.updateObject(state.title, 'filter', null, LocalStorageService.extract(state.title, 'activeFilterTab'));
			LocalStorageService.updateObject(state.title, 'page', 0, LocalStorageService.extract(state.title, 'activeFilterTab'));
			return {
				...state,
				page: 0,
				filter: {}
			};
		case DATA_TABLE_HIDE_COLUMNS:
			return {
				...state,
				hiddenColumns: [...payload]
			};
		case DATA_TABLE_SORT_COLUMNS:
			return {
				...state,
			};
		default:
			return state;
	}
}