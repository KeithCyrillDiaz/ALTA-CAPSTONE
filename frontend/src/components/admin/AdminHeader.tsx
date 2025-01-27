import React from "react"
import { BurgerIcon } from "../icons/BurgerIcon"

interface AdminHeaderProps {
    onClickMenu: () => void;
}
export const AdminHeader:React.FC<AdminHeaderProps> = ({
    onClickMenu
}) => {

    const handleLogout = async () => {
        
    }
    return (
        <div>
            <div className="flex justify-between px-12 py-4 bg-color-primary">
                <h1 className="text-white">ALTA CELESTIA</h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="secondary">Log Out</button>
                    <div onClick={onClickMenu}>
                        <BurgerIcon color="white"/>
                    </div>
                </div>
            </div>
        </div>
    )
}