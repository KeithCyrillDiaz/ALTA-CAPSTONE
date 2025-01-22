import React from "react";

import { RenderJobDescription } from "../../components/RenderJobDescription";
import { useLocation } from "react-router-dom";

// FOR MOBILE VIEW ONLY
const ViewJob: React.FC = () => {
    const location = useLocation();

    const data = location.state;

    return(
       <>
            {data &&  <RenderJobDescription jobDescriptionData={data}/>}
       </>
    )
}

export default ViewJob;