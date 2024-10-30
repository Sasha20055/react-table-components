import {React} from "react";
import {NavDropdown} from "react-bootstrap";
import { useDrag, useDrop } from 'react-dnd';
import cls from "./ColumnsSelector.module.css"
import clsx from "clsx";

export default function SelectorItem({hidden, field, title, eventKey, onClick, onSort, hover, setHover}) {

    const [{ opacity }, drag, preview] = useDrag(() => ({
        type: 'column',
        item: {field, title},
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.3 : 1,
        }),
    }));

    const [, drop] = useDrop(() => ({
        accept: 'column',
        drop: item => onSort(item.field, field),
        hover: () => setHover(field)
    }));

    const isHover = hover === field;
    const isHiddenClassName = hidden ? cls.hidden : "fas fa-fw fa-check"

    return (
        <div ref={drop}>
            <NavDropdown.Item ref={preview} eventKey={eventKey}
                              onClick={onClick} style={{ opacity }}
                              className={clsx({[cls.hover]: isHover})}>
                <i className={isHiddenClassName}/>
                <span ref={drag}>{title}</span>
            </NavDropdown.Item>
        </div>
    );
}