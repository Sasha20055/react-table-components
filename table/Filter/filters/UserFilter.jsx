import React from "react";

import UserSelect from "../../../form/UserSelect";
 
class UserFilter extends React.PureComponent {
	render() {
		return (
			<UserSelect
				name={this.props.field}
				onChange={val => this.props.onChange(val)}
				role={this.props.role}
				activeOnly={this.props.activeOnly}
				value={this.props.value} />		
		);
	}
}

export default UserFilter;