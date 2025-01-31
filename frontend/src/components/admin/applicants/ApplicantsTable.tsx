import React from "react";
import { HeadTitlesTypes, Table, TableDataTypes, TableDataTypesValue } from "../table/Table";


interface ApplicantsTableProps {
    tableData: TableDataTypes[];
    onClickView: (id: TableDataTypesValue) => void;
}

export const ApplicantsTable:React.FC<ApplicantsTableProps> = ({tableData, onClickView}) => {

    const headTitles: HeadTitlesTypes[] = [
        { title: "ID", field: "_id" },
        { title: "Given Name", field: "givenName" },
        { title: "Last Name", field: "lastName" },
        { title: "Gender", field: "gender" },
        { title: "Email", field: "email" },
        { title: "Phone No.", field: "phoneNumber" },
        { title: "Current City", field: "currentCity" },
        { title: "Status", field: "employmentStatus" },
        { title: "AI Rating", field: "resumeAccuracy" },
    ];

    return(
        <Table 
        headTitles={headTitles}
        tableData={tableData}
        onClickView={(id) => onClickView(id)}
        />
    )
}