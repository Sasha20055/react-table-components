import React from "react";

import DictionarySelect from "../../../form/DictionarySelect";
 
class DictionaryFilter extends React.PureComponent {
	
	render() {
		return (
				<DictionarySelect
					name={this.props.field}
					onChange={val => this.props.onChange(val)}
					optionsType={this.props.optionsType}
					multiSelect={this.props.multiSelect}
					activeOnly={this.props.activeOnly}
					value={this.props.value}
					filteredOptions={this.props.filteredOptions} />		
		);
	}
}

export default DictionaryFilter;