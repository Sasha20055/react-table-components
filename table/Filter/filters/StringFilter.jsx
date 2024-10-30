import React from "react";
import { Form } from "react-bootstrap";

class StringFilter extends React.PureComponent {
	render() {
		return (
			<Form.Control size="sm" type={"text"} name={this.props.field}
				placeholder={this.props.title}
				onChange={e => this.props.onChange(e.target.value)}
				value={this.props.value} maxLength={this.props.maxLength || 255}/>);
	}
}

export default StringFilter;