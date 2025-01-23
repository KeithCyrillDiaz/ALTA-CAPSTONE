import React from "react";

import { RenderJobDescription } from "../../components/RenderJobDescription";
import { useLocation } from "react-router-dom";
import { MainLayout } from "../../layouts";


// FOR MOBILE VIEW ONLY
const ViewJob: React.FC = () => {
    const location = useLocation();

    const data = location.state;

    return(
       <MainLayout>
            {data &&  <RenderJobDescription jobDescriptionData={data}/>}
       </MainLayout>
    )
}

export default ViewJob;