import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceType } from "../../hooks";
import { BurgerIcon } from "../icons/BurgerIcon";

const Menu: React.FC = () => {

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <>
        {/* TURN THE BG TO TRANSPARENT BLACK AND CLOSE THE MENU WHEN CLICKED */}
        {showMenu && (
            <div className="w-full h-full z-50 fixed top-0 left-0 text-transparent bg-black opacity-70" 
            onClick={() => setShowMenu(!showMenu)}/>
        )}
        <div className={`main-header-menuContainer ${showMenu ? "open" : ""}`}>
            {buttons.map((button) => {
                const { id, label, path } = button;
                return (
                    <button
                        key={id}
                        onClick={() => navigate(path)} // NAVIGATE TO PATH ON BUTTON CLICK
                    >
                        {label}
                    </button>
                );
            })}
            <button className="primary" onClick={() => navigate('/')}>Join us</button>
        </div>
        {/* overlay */}
        
        <div onClick={() => setShowMenu(!showMenu)}>
            <BurgerIcon/>
        </div>
        </>
    )
}



const buttons = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'solutions', label: 'Solutions', path: '/solutions' },
    { id: 'success', label: 'Success', path: '/success' },
    { id: 'insights', label: 'Insights', path: '/insights' },
];


const Tabs: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="main-tabsContainer">
            <div className="tabs">
                {buttons.map((button) => {
                const { id, label, path } = button;
                return (
                    <button 
                        key={id}
                        onClick={() => navigate(path)} // NAVIGATE TO PATH ON BUTTON CLICK
                    >
                        {label}
                    </button>
                );
            })}
            </div>

            <div className="buttonContainer">
                <button className="primary" onClick={() => navigate('/')}>Join us</button>
            </div>
        </div>
    );
};




const ClientHeader: React.FC= () => {
    
    const {isMobile} = useDeviceType();

    return(
        <div className="main-header">
            <h1>ALTA CELESTIA</h1>
            {isMobile ? (
                <Menu/>
            ) : (
                <Tabs/>
            )}
        </div>
    )
}


export default ClientHeader