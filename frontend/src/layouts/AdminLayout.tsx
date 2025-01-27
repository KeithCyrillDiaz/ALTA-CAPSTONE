import React from "react";
import { AdminHeader } from "../components/admin/AdminHeader";

interface AdminLayoutProps {
    children: React.ReactNode;
}
const AdminLayout: React.FC<AdminLayoutProps> = ({
    children
}) => {
    return(
       <>
        <AdminHeader onClickMenu={() => {}}/>
        <div className ="flex bg-yellow-300">
            {children}
        </div>
       </>
    )
}

export default AdminLayout;