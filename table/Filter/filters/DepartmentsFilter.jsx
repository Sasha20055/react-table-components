import React from "react";
import { Form } from "react-bootstrap";
import optionsService from '../../../../services/OptionsService';

class DepartmentsFilter extends React.PureComponent {
	
	constructor(props) {
		super(props);
		this.state = { departments: [] };
	}
	
	componentDidMount() {
		optionsService.load("DEPARTMENT", this.props.activeOnly).then(data => this.setState({ departments: data }));
	}

	isDepartmentChecked(department) {
		return this.getSelected().some(d => d.id === department.id)
	}

	getSelected() {
		return this.props.value || [];
	}
	
	onChangeDepartment(e) {
		const departments = this.getSelected(),
			department = this.state.departments.find(d => d.value === e.target.name),
			selected = departments.some(d => d.id === department.id);
		if (e.target.checked && !selected) {
			this.props.onChange(departments.concat(department));
		} else if (selected) {
			this.props.onChange(departments.filter(d => d.id !== department.id));
		}
	}
	
	renderDepartments() {
		return (this.state.departments.map(department =>  
				<Form.Check key={department.id} label={department.value}
					id={"department_" + department.id} name={department.value}
					checked={this.isDepartmentChecked(department)} 
					onChange={this.onChangeDepartment.bind(this)} />)
		);
	}

	render() {
		return (
			<React.Fragment>
				<Form.Label htmlFor={this.props.field}>{this.props.title}</Form.Label>
				<div style={{columns: "2 auto"}}>{this.renderDepartments()}</div>
			</React.Fragment>
		);
	}
	
}

export default DepartmentsFilter;