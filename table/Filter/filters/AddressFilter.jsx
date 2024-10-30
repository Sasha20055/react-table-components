import React from "react";
import AddressAsyncSelect from "../../../form/async/AddressAsyncSelect";

class AddressFilter extends React.PureComponent {

    render() {
        return (
            <AddressAsyncSelect
                value={this.props.value}
                onChange={val => this.props.onChange(val)}
            />
        );
    }
}

export default AddressFilter;
