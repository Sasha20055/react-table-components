import React from "react";
import { Form } from "react-bootstrap";

class NumericRangeFilter extends React.PureComponent {

	onChange(postfix, value) {
		const res = this.props.value || {};
		res[postfix] = value;
		this.props.onChange(res);
	}

	onChangeFrom(e) {
		this.onChange("from", e.target.value);	
	}

	onChangeTo(e) {
		this.onChange("to", e.target.value);	
	}
	
	render() {
		const fromName = this.props.field + "From",
			toName = this.props.field + "To";
		return (
			<React.Fragment>
				<Form.Label htmlFor={this.props.field}>{this.props.title}</Form.Label>
				<Form.Control size="sm" type="number"
					placeholder="от"
					name={fromName}
					onChange={e => this.onChangeFrom(e)}
					value={this.props.value?.from} 
					maxLength="10"/>
				<Form.Control size="sm" type="number"
					placeholder="до"
					name={toName}
					onChange={e => this.onChangeTo(e)}
					value={this.props.value?.to} 
					maxLength="10"/>
			</React.Fragment>
		);
	}
}

export default NumericRangeFilter;