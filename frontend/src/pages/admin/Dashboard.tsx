import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { HeroSection } from "../../components/admin/HeroSection";
import { TopApplicants } from "../../components/admin/dashboard/TopApplicants";



const Dashboard: React.FC = () => {

    return (
        <AdminLayout title="DASHBOARD">
            <div className="flex flex-col justify-center gap-4 relative">
                <HeroSection/>
                <TopApplicants month="January" year={2025}/>
            </div>
        </AdminLayout>
    )
}


export default Dashboard;