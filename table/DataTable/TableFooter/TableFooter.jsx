import React, {Fragment, useRef, useState} from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import PageSizeMenu from "../../PageSizeMenu";
import Pagination from "../../pagination";
import cls from "../DataTable.module.css"
import {DATA_TABLE_PAGE} from "../../../../actions/types";

const TableFooter = (props) => {

    const pageSizeMenu = useRef(null)

    // функционал не реализован
    const [pageSizeElement, setPageSizeElement] = useState(null);


    const {
        showPageSizeMenu,
        onShowPageSizeMenu,
        page,
        totalPages,
        dispatch,
        pageSize,
        hidePageSizeOptions,
        fetch,
        search,
        sort,
        defaultFilterParam,
        getFilter,
        getFilterTabsValue,
        setData
    } = props;


    const onPageChanged = (page) => {
        dispatch({type: DATA_TABLE_PAGE, payload: page});
    }

    const changePageSize = async (newPageSize) => {
        const params = {
            search,
            page,
            pageSize: newPageSize,
            sort,
            ...await getFilter()
        };

        if (defaultFilterParam) {
            params[defaultFilterParam] = getFilterTabsValue();
        }
        const response = await fetch(params);
        localStorage.setItem("pageSize", newPageSize);
        setData(response.data, response.pages, newPageSize);
    };

    const renderPageSizeOptions = () => {
        if (hidePageSizeOptions) {
            return <Fragment />;
        }

        return (
            <div>
                <Button
                    size="sm"
                    variant="light"
                    onClick={() => onShowPageSizeMenu(!showPageSizeMenu)}
                >
                    Показать {pageSize} записей
                </Button>
            </div>
        );
    };

    return (
        <div className={cls.pageSizeMenu}>
            <PageSizeMenu
                ref={pageSizeMenu}
                element={pageSizeElement}
                show={showPageSizeMenu}
                onChangePageSize={changePageSize}
                onShow={onShowPageSizeMenu}
            />
            <Row>
                <Col>
                    {renderPageSizeOptions()}
                </Col>
                <Col>
                    <Pagination page={page} pages={totalPages} onPageChanged={onPageChanged} />
                </Col>
            </Row>
        </div>
    );
};

export default TableFooter;