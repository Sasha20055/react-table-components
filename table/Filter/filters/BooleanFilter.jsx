import React from "react";
import { Form } from "react-bootstrap";

class BooleanFilter extends React.PureComponent {
	constructor(props) {
		super(props);
		this.yesRef = React.createRef();
		this.noRef = React.createRef();
	}
	
	formatValue() {
		let value = '';
		if (this.yesRef.checked && !this.noRef.checked) {
			value = 'true';
		} else if (!this.yesRef.checked && this.noRef.checked) {
			value = 'false';
		}
		return value;
	}

	render() {
		const isTrue = this.props.value === "true",
			isFalse = this.props.value === "false",
			isEmpty = !isTrue && !isFalse;
		return (
			<React.Fragment>
				<Form.Label htmlFor={this.props.field}>{this.props.title}</Form.Label>
				<div>
					<Form.Check inline ref={r => this.yesRef = r}
						label="да"
						name={this.props.field}
						type="checkbox"
						checked={isTrue || isEmpty}
						onChange={e => this.props.onChange(this.formatValue(e))}
					/>
					<Form.Check inline ref={r => this.noRef = r}
						label="нет"
						name={this.props.field}
						type="checkbox"
						checked={isFalse || isEmpty}
					onChange={e => this.props.onChange(this.formatValue(e))}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default BooleanFilter;