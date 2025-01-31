import React from "react";
import { HeadTitlesTypes, Table, TableDataTypes, TableDataTypesValue } from "../table/Table";


interface JobTableProps {
    tableData: TableDataTypes[];
    onClickView: (id: TableDataTypesValue) => void;
}

export const JobTable:React.FC<JobTableProps> = ({tableData, onClickView}) => {

    const headTitles: HeadTitlesTypes[] = [
        { title: "ID", field: "_id" },
        { title: "Job Title", field: "jobTitle" },
        { title: "Budget", field: "minSalary" },
        { title: "Date Published", field: "datePublished" },
        { title: "Slot", field: "slot" },
        { title: "Employment Type", field: "employmentType" },
        { title: "Applicants", field: "applicants" },
        { title: "Work Mode", field: "workMode" },
        { title: "Status", field: "status" },
    ];

    return(
        <Table 
        headTitles={headTitles}
        tableData={tableData}
        onClickView={(id) => onClickView(id)}
        />
    )
}