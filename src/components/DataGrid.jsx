import React from "react";
import "../App.css"

const DataGrid = ({ csv }) => {
    if(!csv){
        return null;
    }

    return(
        <table className="table table-sm table-bordered table-hover table-responsive text-center">
            <thead className="bg-primary text-light">
                <tr >
                    {csv.header.map((headerName) => (
                        <th key={headerName}>{headerName}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {csv.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((col, colIndex) => (
                            <td key={colIndex}>{col}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default DataGrid;