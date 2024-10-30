import React from "react";
import { connect } from 'react-redux';

import { Button } from "react-bootstrap";

import StringFilter from './filters/StringFilter';
import BooleanFilter from './filters/BooleanFilter';
import DictionaryFilter from './filters/DictionaryFilter';
import RolesFilter from './filters/RolesFilter';
import EnumFilter from './filters/EnumFilter';
import DateRangeFilter from './filters/DateRangeFilter';
import UserFilter from './filters/UserFilter';
import NumericRangeFilter from './filters/NumericRangeFilter';
import DepartmentsFilter from './filters/DepartmentsFilter';

import DataTable from '../DataTable/DataTable';
import {
	DATA_TABLE_FILTER,
	DATA_TABLE_SHOW_FILTER
} from "../../../actions/types";
import AddressFilter from "./filters/AddressFilter";

function mapStateToProps(state, ownProps) {
	return {
		filter: state.filter,
		config: state.filterConfig
	};
}
class Filter extends React.PureComponent  {

	static get RECT() { return { W: 200, H: 100 } }

	constructor(props) {
		super(props);

		this.mouseListener = this.mouseListener.bind(this);

		this.divContainer = React.createRef();

		this.state = { filter: this.props.filter?.[this.props.config?.field] };
	}

	onChange(value) {
		this.setState({ filter: {[this.props.config?.field]: value} });
	}

	mouseListener(e) {
		if (e.target.classList.contains('fa-filter')) {
			return;
		}
		if (!this.divContainer.current?.contains(e.target)) {
			this.close();
		}
	}

	addRemoveMouseListener(listen) {
		const addRemove = listen ? document.body.addEventListener : document.body.removeEventListener;
		addRemove('mousedown', this.mouseListener, true);
	}

	close() {
		this.addRemoveMouseListener(false);
		this.props.dispatch({ type: DATA_TABLE_SHOW_FILTER, payload: null });
	}

	calculateHeight() {
		switch (this.props.config.type) {
			case DataTable.BOOLEAN_FILTER:
				return "12%";
			case DataTable.DATE_RANGE_FILTER:
			case DataTable.NUMERIC_RANGE_FILTER:
				return "16%";
			case DataTable.DEPARTMENTS_FILTER:
				return "33%";
			default:
				return Filter.RECT.H;
		}
	}

	calculateWidth() {
		switch (this.props.config.type) {
			case DataTable.BOOLEAN_FILTER:
				return 190;
			case DataTable.DICTIONARY_FILTER:
			case DataTable.USER_FILTER:
				return 300;
			case DataTable.DEPARTMENTS_FILTER:
				return 330;
			default:
				return Filter.RECT.W;
		}
	}

	createPositionStyle() {
		const pos = this.props.config.pos,
			width = this.calculateWidth(),
			left = pos.left ? pos.left : (pos.right - width);

		return {
			width: `${width}px`,
			height: `${this.calculateHeight()}`,
			top: pos.top,
			left
		};
	}

	getOkActionPayload() {
		return {
			field: this.props.config.field,
			value: this.state.filter,
			updateFilter: true
		};
	}

	onApply() {
		this.props.dispatch({ type: DATA_TABLE_FILTER, payload: this.getOkActionPayload() });
		this.close();
	}

	renderOkCancel() {
		return (
			<div className="text-center buttons">
				<Button onClick={this.onApply.bind(this)} size="sm" variant="primary" className="pull-right">
					Ок
			  	</Button>
				&nbsp;
				<Button onClick={this.close.bind(this)} size="sm" variant="secondary" className="pull-right">
					Отмена
			  	</Button>
			</div>
		);
	}

	renderFilterInputs() {
		const props = {
			onChange: this.onChange.bind(this),
			field: this.props.config.field,
			title: this.props.config.title,
			value: this.state.filter?.[this.props.config.field] || ''
		};
		let ctrl = null;
		switch (this.props.config.type) {
			case DataTable.DICTIONARY_FILTER:
				ctrl = <DictionaryFilter {...props} optionsType={this.props.config.optionsType} multiSelect={this.props.config.multiSelect} activeOnly={this.props.config.activeOnly} filteredOptions={this.props.config.filteredOptions}/>
				break;
			case DataTable.ENUM_FILTER:
				ctrl = <EnumFilter {...props} optionsType={this.props.config.optionsType} multiSelect={this.props.config.multiSelect}/>
				break;
			case DataTable.BOOLEAN_FILTER:
				ctrl = <BooleanFilter {...props} />
				break;
			case DataTable.ROLES_FILTER:
				ctrl = <RolesFilter {...props} filteredOptions={this.props.config.filteredOptions} />
				break;
			case DataTable.DATE_RANGE_FILTER:
				ctrl = <DateRangeFilter {...props} />
				break;
			case DataTable.INSTANT_DATE_RANGE_FILTER:
				ctrl = <DateRangeFilter {...props} isInstant={true} />
				break;
			case DataTable.NUMERIC_RANGE_FILTER:
				ctrl = <NumericRangeFilter {...props} />
				break;
			case DataTable.USER_FILTER:
				ctrl = <UserFilter {...props} role={this.props.config.role} activeOnly={this.props.config.activeOnly} />
				break;
			case DataTable.DEPARTMENTS_FILTER:
				ctrl = <DepartmentsFilter {...props} activeOnly={this.props.config.activeOnly} />
				break;
			case DataTable.ADDRESS_FILTER:
				ctrl = <AddressFilter {...props} />
				break;
			default:
				ctrl = <StringFilter {...props} />
				break;
		}
		return (
			<div className="mb-2">
				{ctrl}
			</div>
		);
	}

	render() {
		if (this.props.config?.pos) {
			this.addRemoveMouseListener(true);
			return (
				<div className='filter' style={this.createPositionStyle()} ref={this.divContainer}>
					{this.renderFilterInputs()}
					{this.renderOkCancel()}
				</div>
			);
		} else {
			this.addRemoveMouseListener(false);
			return (null);
		}
	}
}
export default connect(mapStateToProps)(Filter);
