import React from "react";
import { Form } from "react-bootstrap";

import DtPicker from '../../../form/DtPicker';

class DateRangeFilter extends React.PureComponent {

	onChange(postfix, value) {
		const res = this.props.value || {};
		res[postfix] = value;
		this.props.onChange(res);
	}

	onChangeFrom(e) {
		this.onChange("from", this.props.isInstant ? e + "Z" : e);
	}

	onChangeTo(e) {
		this.onChange("to", this.props.isInstant ? e + "Z" : e);
	}
	
	render() {
		const fromName = this.props.field + "From",
			toName = this.props.field + "To";
		return (
			<React.Fragment>

				<Form.Label htmlFor={this.props.field}>{this.props.title}</Form.Label>

				<DtPicker
					placeholder="от"
					showTimeSelect={!!this.props.showTimeSelect}
					value={this.props.value?.from}
					name={fromName}
					onChange={e => this.onChangeFrom(e)} />

				<DtPicker
					placeholder="до"
					showTimeSelect={!!this.props.showTimeSelect}
					value={this.props.value?.to}
					name={toName}
					onChange={e => this.onChangeTo(e)} />
			</React.Fragment>
		);
	}
}

export default DateRangeFilter;