import React, { ReactNode } from "react";
import { UserApplicationTypes } from "../../../pages/admin/Dashboard";
import { TablePagination } from "./TablePagination";
import usePagination from "../../../hooks/usePagination";

export type TableDataTypesValue = string | number | ReactNode;
export type TableDataTypes = {
    [key: string]: TableDataTypesValue;
};

interface HeadTitlesTypes {
    title: string; // THIS WILL BE THE TABLE HEAD LABEL
    field: keyof UserApplicationTypes;
}
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

    const {paginatedData, currentPage, handleChangePage, totalPages} = usePagination(tableData);

    return(
        <div className="min-h-[400px]">
            <table>
                <thead>
                    <tr>
                        {headTitles.map((item, index) => (
                            <th key={index}>
                                <p>{item.title}</p>
                            </th>
                        ))}
                        <th><p>Actions</p></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((userData, index) => {
                        const {_id} = userData;
                        return (
                            <tr key={index}>
                                {headTitles.map((item, idx) => (
                                    <td key={idx}>
                                        <p>{userData[item.field]}</p>
                                    </td>
                                ))}
                                <td>
                                    <button onClick={() => onClickView(_id)} className="primary">View</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <TablePagination
            currentPage={currentPage}
            handlePageChange={handleChangePage}
            totalPages={totalPages}
            />
        </div>
    )
}