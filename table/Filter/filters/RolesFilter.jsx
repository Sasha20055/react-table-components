import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";


import { securityService } from '../../../../services/SecurityService';

class RolesFilter extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	
	async onChangeRole(e) {
		const roles = e?.map(role => role.value)
		await this.props.onChange(roles)
	}

	getCheckedRoles(roles) {
		return roles?.filter(role => this.props.value.includes(role.value))
	}

	getSelectedRoles(roles) {
		return roles?.map(role => {return {label: securityService.getRoleName(role), value: role}})
	}

	render() {
		let roles = this.props.filteredOptions || securityService.getRoles();
		const rolesSelectObj = this.getSelectedRoles(roles)
		const selectedRoles = this.getCheckedRoles(rolesSelectObj)

		return (
			<React.Fragment>
				<Select
					onChange={this.onChangeRole.bind(this)}
					options={rolesSelectObj}
					loadingMessage={() => "загрузка"}
					noOptionsMessage={() => "нет данных"}
					classNamePrefix="react-select"
					value={selectedRoles}
					isMulti={true}
					isSearchable={true}
					onBlurResetsInput={false}
					onCloseResetsInput={false}
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
					placeholder="(выбрать)" isClearable/>
			</React.Fragment>
		);
	}
}

export default RolesFilter;