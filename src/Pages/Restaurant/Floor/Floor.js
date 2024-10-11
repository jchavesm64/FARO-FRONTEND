import React, { useState, useEffect, useCallback } from "react";
import Table from "./Table";

const Floor = ({ data, selectTable }) => {
    const [tables, setTables] = useState(data);
    useEffect(() => {
        setTables(prevTables =>
            data.map(newTable => ({
                ...newTable,
                isSelected: prevTables.find(t => t.id === newTable.id)?.isSelected || false
            }))
        );
    }, [data]);

    const onClickTable = useCallback((tableId) => {
        setTables((prevTables) => {
            const updatedTables = prevTables.map((table) => ({
                ...table,
                isSelected: table.id === tableId
            }));

            const updatedTable = updatedTables.find((table) => table.id === tableId);
            selectTable(updatedTable);

            return updatedTables;
        });
    }, [selectTable]);

    const deselectTable = useCallback((event) => {
        // Prevent deselection when clicking on a table
        if (event.target.closest('.table')) return;

        setTables((prevTables) =>
            prevTables.map((table) => ({ ...table, isSelected: false }))
        );
        selectTable(null);
    }, [selectTable]);

    return (
        <div className="card-floor floor-container floor-full-height" onClick={deselectTable}>
            {tables.map((table) => (
                <Table
                    key={table.id}
                    data={table}
                    onClickTable={onClickTable}
                />
            ))}
        </div>
    );
};

export default Floor;