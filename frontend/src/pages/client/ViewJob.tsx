import React, { useEffect } from "react";

import { RenderJobDescription } from "../../components/RenderJobDescription";
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../../layouts";
import { useDeviceType } from "../../hooks";
import { useDispatch } from "react-redux";
import { findJob } from "../../redux/slice/jobSlice";


// FOR MOBILE VIEW ONLY
const ViewJob: React.FC = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    //GET THE JOB DATA FROM ANOTHER PAGE
    const data = location.state;

    // CUSTOM HOOK
    const {isMobile} = useDeviceType();
    
    //CHECK IF THE DEVICE IS NOT MOBILE
    useEffect(() => {
        if (!isMobile && data) {
          const { _id } = data;
          dispatch(findJob(_id)); 
          navigate("/"); // REDIRECT TO HOMR
        }
      }, [isMobile, data, dispatch, navigate]);

    return(
       <MainLayout>
            <div className="feedContainer">
                {data &&  <RenderJobDescription jobDescriptionData={data}/>}
            </div>
            
       </MainLayout>
    )
}

export default ViewJob;