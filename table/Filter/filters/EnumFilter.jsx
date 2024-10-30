import React from "react";

import { ENUM_NAME } from '../../../../utils/consts/Enums';
import EnumSelect from "../../../form/EnumSelect";

class EnumFilter extends React.PureComponent {
	render() {
		return (
			<EnumSelect
				name={this.props.field}
				onChange={val => this.props.onChange(val)}
				optionsType={ENUM_NAME[this.props.optionsType]}
				value={this.props.value}
				multiSelect={this.props.multiSelect}
			/>
		);
	}
}

export default EnumFilter;