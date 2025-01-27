import React, { useState } from "react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminMenu } from "../components/admin/AdminMenu";
import { useDeviceType } from "../hooks";

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    title
}) => {
    const {isDesktop} = useDeviceType();
    // ONLY SHOW THE MENU ON LOAD IN DESKTOP DEVICES
    const [showMenu, setShowMenu] = useState<boolean>(isDesktop);
    return(
       <>
        <AdminHeader onClickMenu={() => setShowMenu(!showMenu)}/>

        {/* Dummy space */}
        {!isDesktop && (
            
            <div className="h-[80px] w-full bg-transparent">space</div>
        )}

        <div className="flex gap-4">
            <AdminMenu visible={showMenu}/>
            <div className="w-full px-4 pt-4">
                <h3 className="text-[20px]">{title}</h3>
                <div className ="flex flex-col container">
                    {children}
                </div>
            </div>
            
        </div>
       </>
    )
}

export default AdminLayout;