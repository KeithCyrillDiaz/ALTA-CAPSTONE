import React from "react"
import { useDeviceType } from "../hooks";
import ClientHeader from "../components/client/ClientHeader";


interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
}) => {
    
    const {isMobile} = useDeviceType()
    return (
        <>
            <ClientHeader/>
            <div className={`${!isMobile ? "flex flex-col items-center justify-center" : ""}`}>
                <div className={`container ${!isMobile ? "flex flex-col items-end" : ""}`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default MainLayout;