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

        {/* DUMMY SPACE SINCE HEADER IS ABSOLUTE SO WE NEED TO PUT SOMETHING TO COVER THE SPACE UNDER THE HEADER */}
        <div className="h-[70px] w-full bg-transparent">space</div>

        <div className="flex gap-4 h-full relative">
            <AdminMenu visible={showMenu || isDesktop}/>
            
            {/* DUMMY SPACE IN DSKTOP MODE SINCE ADMIN MENU IS FIXED TO COVER THE SPACE UNDER THE MENU*/}
            {isDesktop && (
                <div className=" w-[300px] bg-transparent">space</div>
            )}

            <div className="w-full px-4 pt-8">
                <h3 className="text-[20px]">{title}</h3>
                <div className ="flex flex-col">
                    {children}
                </div>
            </div>
            
        </div>
       </>
    )
}

export default AdminLayout;