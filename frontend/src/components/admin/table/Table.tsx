import { ReactNode } from "react";
import usePagination from "../../../hooks/usePagination";
import { UserApplicationTypes } from "../../../pages/admin/Dashboard";
import { TablePagination } from "./TablePagination";
import { JobDataTypes } from "../../client/JobFeed";
import { EmployeeDataTypes } from "../../../pages/admin/Employees/Employees";


export type TableDataTypesValue = string | number | ReactNode;
export type TableDataTypes = {
    [key: string]: TableDataTypesValue;
};

export interface HeadTitlesTypes {
    title: string; // THIS WILL BE THE TABLE HEAD LABEL
    field: keyof UserApplicationTypes | keyof JobDataTypes | keyof EmployeeDataTypes;
}

interface TableProps {
    headTitles: HeadTitlesTypes[];
    onClickView: (id: TableDataTypesValue) => void;
    tableData: TableDataTypes[]
}

export const Table:React.FC<TableProps> = ({
    headTitles,
    onClickView,
    tableData
}) => {

    const {paginatedData, currentPage, handleChangePage, totalPages} = usePagination(tableData);

    return (
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