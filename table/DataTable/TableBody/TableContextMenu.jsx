import React, {useEffect, useRef} from 'react';
import cls from '../DataTable.module.css'; // Импортируйте ваши стили

const TableContextMenu = (props) => {

    const menuRef = useRef(null)

    const {
        contextMenuObj,
        menuVisible,
        menuPosition,
        menuActiveRow,
        setMenuVisible,
    } = props;

    useEffect(() => {
        if (contextMenuObj) {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('mousedown', handleClickOutside);
        }
    }, []);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            event.type === "mousedown" && setMenuVisible(false);
        }
    }

    if (!menuVisible) return null;

    const onClickMenu = (action) => {
        setMenuVisible(false)
        action(menuActiveRow)
    }

    return (
        <ul
            ref={menuRef}
            className={cls.contextMenu}
            style={{ top: menuPosition.y, left: menuPosition.x }}
        >
            {contextMenuObj.map((obj) =>
                obj && obj.isVisible(menuActiveRow) ? (
                    <a
                        className={cls.contextMenuItem}
                        onClick={() => onClickMenu(obj.action)}
                        key={obj.title}
                    >
                        {obj.title}
                    </a>
                ) : null
            )}
        </ul>
    );
};

export default TableContextMenu;