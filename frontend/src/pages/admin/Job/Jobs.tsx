import { useEffect, useState } from "react";
import { Loader } from "../../../components";
import { HeroSection } from "../../../components/admin/HeroSection";
import { Options } from "../../../components/admin/Options";
import AdminLayout from "../../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { fetchAdminJobData } from "../../../api/apiCalls/admin/job";
import { clearAdminJobFilter, searchAdminJobFilter, setAdminJobData} from "../../../redux/slice/admin/jobSlice";
import { JobTable } from "../../../components/admin/job/JobTable";
import { AdminFilter } from "../../../components/admin/AdminFilterModal";
import { TableDataTypes } from "../../../components/admin/table/Table";

const Jobs: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jobs = useSelector((state: RootState) => state.adminJob.filteredJobData);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchAdminJobData();
            dispatch((setAdminJobData(data)));
            setLoading(false);
        }

        fetchData();
    },[dispatch]);
    return (
        <AdminLayout title="JOB">
             <div className="flex flex-col justify-center gap-4 relative pb-12">
                <HeroSection/>
                <main>
                    {loading ? (
                        <Loader/>
                    ) : (
                        <div className="container flex flex-col gap-2">
                            <div className="flex items-center justify-end gap-2">
                                <Options
                                onChangeSearchText={(text) => dispatch(searchAdminJobFilter(text))}
                                onFilterClick={() => setShowFilterModal(!showFilterModal)}
                                onSearchClick={() =>{}} //TO AVOID ERRORS
                                onClickClearFilter={() => dispatch(clearAdminJobFilter())}
                                />
                                <button onClick = {() => navigate('/admin/jobs/add')} className="primary">+ Add Job</button>
                            </div>
                            {jobs && <JobTable   
                            onClickView={(id) => navigate(`/admin/jobs/view/${id}`)} 
                            tableData={jobs as TableDataTypes[]}/>}
                        </div>
                    )}
                </main>        
            </div>
             <AdminFilter
            visible={showFilterModal}
            type="Jobs"
            onClickCancel={() => setShowFilterModal(false)}
            />
        </AdminLayout>
    )
}


export default Jobs;