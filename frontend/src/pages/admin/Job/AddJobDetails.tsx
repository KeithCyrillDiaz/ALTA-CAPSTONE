import { useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { RenderJobDescription } from "../../../components/RenderJobDescription";
import { JobPostingForm } from "../../../components/admin/job/JobPostingForm";
import { useDispatch } from "react-redux";
import { setEditableForm } from "../../../redux/slice/admin/jobSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { JobDataTypes } from "../../../components/client/JobFeed";




const AddJobDetails: React.FC = () => {

    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => state.adminJob.editableForm);

  
    //RESET THE EDITABLE FORM FOR THE USER TO FREELY ADD THE NECESSARY JOB DETAILS
    useEffect(() => {
        const emptyForm: Partial<JobDataTypes> = {
            jobTitle: "",
            jobDescription: [
                {
                    dummyId: `${Date.now()}`,
                    title: "",
                    paragraph: "",
                    isBullet: false,
                    bulletData: []
                }
            ],
            skills: [],
            education: [],
            isSalaryRange: false,
            minSalary: 0,
            maxSalary: 0,
            salaryType: "",
            employmentType: "",
            shift: "",
            schedule: ""
        }

        dispatch(setEditableForm(emptyForm as JobDataTypes));
    },[dispatch])
    
    return (
        <AdminLayout title="Job">
            <div className="container">
                <div className="feedContainer">
                    {form && <RenderJobDescription 
                    jobDescriptionData={form}
                    onEdit={true}
                    />}
                    {form && <JobPostingForm newJobPost={true} data={form}/>}
                </div>
            </div>
            
        </AdminLayout>
    )
}


export default AddJobDetails;