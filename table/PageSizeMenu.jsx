import {Fragment} from "react";
import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import cls from "./DataTable/DataTable.module.css"

class PageSizeMenu extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let pageSizeOptions = [];
        const start = 10;
        const step = 10;
        const end = 100;
        for (let i = start; i <= end; i += step) {
            pageSizeOptions.push(i);
        }
        const top = this.props.element?.top + window.scrollY;
        const left = this.props.element?.left;
        if (!this.props.show) {
            return <Fragment/>
        }
        return (
                <ButtonGroup
                    vertical
                    ref={this.props.ref}
                    className={cls.pageSizeContainer}
                    style={{
                        top: top - 60,
                        left: left - 240,
                    }}>
                    {pageSizeOptions.map((option) => {
                        return <Button
                                size="sm"
                                variant="light"
                                key={option}
                                onClick={() => this.handleClick(option)}>{option}
                            </Button>
                    })}
                </ButtonGroup>
        );
    }

    handleClick(option) {
        this.props.onChangePageSize(option);
        this.props.onShow(false);
    }
}

export default PageSizeMenu;