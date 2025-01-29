import { PaginationLeftArrow, PaginationRightArrow } from "../../icons/admin/PaginationArrows";

interface TablePaginationProps {
    currentPage: number,
    totalPages: number,
    handlePageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    handlePageChange
}) => {
    return(
        <div className="pagination">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(currentPage - 1)}>
                    <PaginationLeftArrow/>

                </button>
                {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index} 
                    className={`pageNumber ${currentPage === index + 1 ? 'primary' : 'secondary'}`} 
                    onClick={() => handlePageChange(index + 1)}>
                    <strong>{index + 1}</strong>
                </button>
                ))}
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => handlePageChange(currentPage + 1)}>
                    <PaginationRightArrow/>

                </button>
            </div>
    )
}