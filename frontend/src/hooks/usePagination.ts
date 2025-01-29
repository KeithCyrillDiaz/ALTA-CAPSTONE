import { useState } from "react";
import { TableDataTypes } from "../components/admin/table/ApplicantsTable";

const usePagination = (data: TableDataTypes[]) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate the start and end index for slicing the array
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    }

    return {
        currentPage,
        paginatedData,
        totalPages,
        handleChangePage
    }
}

export default usePagination;