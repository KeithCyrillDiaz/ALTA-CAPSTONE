import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { HeroSection } from "../../../components/admin/HeroSection";
import { ApplicantsTable, TableDataTypes} from "../../../components/admin/table/ApplicantsTable";
import { getAllUserApplicants} from "../../../api/apiCalls/admin/applicants/applicant";
import { Loader } from "../../../components";
import { useNavigate } from "react-router-dom";
import { Options } from "../../../components/admin/Options";
import { AdminFilter } from "../../../components/admin/AdminFilterModal";
import { useDispatch } from "react-redux";
import { setApplicationData } from "../../../redux/slice/admin/applicationsSlice";

const Applicants: React.FC = () => {

    const [loading, setLoading] =useState<boolean>(true);
    const [tableData, setTableData] =useState<TableDataTypes[]>();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    
    // REDUX
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchTableData = async () => {
            setLoading(true);
            const data = await getAllUserApplicants();
            // console.log("data: ", JSON.stringify(data, null, 2))
            setTableData(data);
            dispatch(setApplicationData(data));
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
                        <div className="container flex flex-col gap-2">
                            <Options 
                            onChangeSearchText={(text) => setSearchText(text)}
                            onFilterClick={() => setShowFilterModal(!showFilterModal)}
                            onSearchClick={() => {}}
                            />
                            {tableData && <ApplicantsTable onClickView={(id) => navigate(`/admin/applicant/view/${id}`)} tableData={tableData}/>}
                        </div>
                    )}
                </main>
            </div>
            <AdminFilter
            visible={showFilterModal}
            type="Applicants"
            />
        </AdminLayout>
    )
}

export default Applicants