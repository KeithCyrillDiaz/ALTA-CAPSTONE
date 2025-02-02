import React from "react";
import { HeadTitlesTypes, Table, TableDataTypes, TableDataTypesValue } from "../table/Table";


interface EmployeeTableProps {
    tableData: TableDataTypes[];
    onClickView: (id: TableDataTypesValue) => void;
}

export const EmployeeTable:React.FC<EmployeeTableProps> = ({tableData, onClickView}) => {

    const headTitles: HeadTitlesTypes[] = [
        { title: "ID", field: "_id" },
        { title: "Given Name", field: "givenName" },
        { title: "Last Name", field: "lastName" },
        { title: "Gender", field: "gender" },
        { title: "Company Email", field: "companyEmail" },
        { title: "Phone No.", field: "phoneNumber" },
        { title: "Salary", field: "salary" },
        { title: "Position", field: "position" },
    ];

    return(
        <Table 
        headTitles={headTitles}
        tableData={tableData}
        onClickView={(id) => onClickView(id)}
        />
    )
}