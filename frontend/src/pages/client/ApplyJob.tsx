import React from "react";
import { MainLayout } from "../../layouts";
import { FilterJob, JobForm, Search } from "../../components";



const ApplyJob: React.FC = () => {
    return (
        <MainLayout>
            <div className='flex flex-row items-center'>
                <Search onClick={() => {}} onChangeText={() => {}}/>
                <FilterJob/>
            </div>
            <JobForm/>
        </MainLayout>
    )
}


export default ApplyJob;