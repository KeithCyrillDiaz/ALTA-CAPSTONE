import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { HeroSection } from "../../../components/admin/HeroSection";
import { ApplicantsTable} from "../../../components/admin/applicants/ApplicantsTable";
import { getAllUserApplicants} from "../../../api/apiCalls/admin/applicant";
import { Loader } from "../../../components";
import { useNavigate } from "react-router-dom";
import { Options } from "../../../components/admin/Options";
import { AdminFilter } from "../../../components/admin/AdminFilterModal";
import { useDispatch } from "react-redux";
import { clearApplicantsFilter, searchApplicantsFilter, setApplicationData } from "../../../redux/slice/admin/applicationsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { TableDataTypes } from "../../../components/admin/table/Table";

const Applicants: React.FC = () => {

    const applicantionsData = useSelector((state: RootState) => state.adminApplications.filteredApplicationData)
    const [loading, setLoading] =useState<boolean>(true);
    const navigate = useNavigate();
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    
    // REDUX
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTableData = async () => {
            setLoading(true);
            const data = await getAllUserApplicants();
            // console.log("data: ", JSON.stringify(data, null, 2))
            dispatch(setApplicationData(data));
            setLoading(false)
        }
        fetchTableData();
    },[dispatch]);

    return(
        <AdminLayout title="APPLICANT">
            <div className="flex flex-col gap-4 relative pb-12">
                <HeroSection/>
                <main>
                    {loading ? (
                        <Loader/>
                    ) : (
                        <div className="container flex flex-col gap-2">
                            <Options 
                            onChangeSearchText={(text) => dispatch(searchApplicantsFilter(text))}
                            onFilterClick={() => setShowFilterModal(!showFilterModal)}
                            onSearchClick={() =>{}} //TO AVOID ERRORS
                            onClickClearFilter={() => dispatch(clearApplicantsFilter())}
                            />
                            {applicantionsData && <ApplicantsTable 
                            onClickView={(id) => navigate(`/admin/applicant/view/${id}`)} 
                            tableData={applicantionsData as TableDataTypes[]}/>}
                        </div>
                    )}
                </main>
            </div>
            <AdminFilter
            visible={showFilterModal}
            type="Applicants"
            onClickCancel={() => setShowFilterModal(false)}
            />
        </AdminLayout>
    )
}

export default Applicants