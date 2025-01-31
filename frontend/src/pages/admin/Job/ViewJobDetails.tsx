import { useEffect, useState } from "react";
import { Loader } from "../../../components";
import AdminLayout from "../../../layouts/AdminLayout";
import { RenderJobDescription } from "../../../components/RenderJobDescription";
import { useParams } from "react-router-dom";
import { fetchJobDataById } from "../../../api/apiCalls/admin/job";
import { JobPostingForm } from "../../../components/admin/job/JobPostingForm";
import { useDispatch } from "react-redux";
import { setEditableForm } from "../../../redux/slice/admin/jobSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";




const ViewJobDetails: React.FC = () => {

    const {id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => state.adminJob.editableForm);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchJobDataById(id);
            dispatch(setEditableForm(data));
            setLoading(false)
        }

        fetchData();
    },[id, dispatch])
    
    if(loading) {
        return <Loader/>
    }
    return (
        <AdminLayout title="Job">
            <div className="container">
                <div className="feedContainer">
                    {form && <RenderJobDescription 
                    jobDescriptionData={form}
                    onEdit={true}
                    />}
                    {form && <JobPostingForm data={form}/>}
                </div>
            </div>
            
        </AdminLayout>
    )
}


export default ViewJobDetails;