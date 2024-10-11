import React from "react";

const Table = ({ ...props }) => {
    const { data, onClickTable } = props;
    const { id, name, pos, isChair, isSelected, isReserved, hasOrder } = data;

    const onClick = async (e, id) => {
        e.stopPropagation();
        await onClickTable(id)
    }

    return (
        <React.Fragment>
            <button
                type="button"
                className={`btn-table ${isChair && "chair"} ${isSelected && "selected"} ${hasOrder && "has-order"} ${isReserved && "reserved"}`}
                onClick={(e) => onClick(e, id)}
                style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
            >
                {name}
            </button>
        </React.Fragment>
    );
};

export default Table;
