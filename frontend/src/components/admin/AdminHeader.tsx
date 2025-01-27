import React from "react"
import { BurgerIcon } from "../icons/BurgerIcon"
import { adminLogout } from "../../api/apiCalls/admin";
import { useNavigate } from "react-router-dom";
import { useDeviceType } from "../../hooks";

interface AdminHeaderProps {
    onClickMenu: () => void;
}
export const AdminHeader:React.FC<AdminHeaderProps> = ({
    onClickMenu
}) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await adminLogout();
        navigate('/admin/login');
    }

    const {isMobile} = useDeviceType();
    return (
        <div className={`flex justify-between px-12 py-4 bg-color-primary ${isMobile ? "z-20 absolute w-full" : ""}`}>
            <h1 className="text-white">ALTA CELESTIA ADMIN</h1>
            <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="secondary">Log Out</button>
                {/* ONLY SHOWS THE BURGER MENU IN MOBILE DEVICE */}
                {isMobile && (
                    <div onClick={onClickMenu}>
                    <BurgerIcon color="white"/>
                </div>
                )}
            </div>
        </div>
    
    )
}