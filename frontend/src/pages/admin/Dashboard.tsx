import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { HeroSection } from "../../components/admin/dashboard/HeroSection";



const Dashboard: React.FC = () => {

    return (
        <AdminLayout title="DASHBOARD">
            <div className="flex flex-col justify-center gap-4 relative">
                <HeroSection/>
            </div>
        </AdminLayout>
    )
}


export default Dashboard;