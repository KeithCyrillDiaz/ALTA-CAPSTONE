import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { HeroSection } from "../../../components/admin/HeroSection";
import { ApplicantsTable, TableDataTypes} from "../../../components/admin/table/ApplicantsTable";
import { getAllUserApplicants} from "../../../api/apiCalls/admin/applicants/applicant";
import { Loader } from "../../../components";
import { useNavigate } from "react-router-dom";

const Applicants: React.FC = () => {

    const [loading, setLoading] =useState<boolean>(true);
    const [tableData, setTableData] =useState<TableDataTypes[]>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTableData = async () => {
            setLoading(true);
            const data = await getAllUserApplicants();
            // console.log("data: ", JSON.stringify(data, null, 2))
            setTableData(data);
            setLoading(false)
        }
        fetchTableData();
    },[]);

    return(
        <AdminLayout title="APPLICANT">
            <div className="flex flex-col gap-4 relative pb-12">
                <HeroSection/>
                <main>
                    {loading ? (
                        <Loader/>
                    ) : (
                        <div className="container">
                            {tableData && <ApplicantsTable onClickView={(id) => navigate(`/admin/applicant/view/${id}`)} tableData={tableData}/>}
                        </div>
                    )}
                </main>
            </div>
        </AdminLayout>
    )
}

export default Applicants