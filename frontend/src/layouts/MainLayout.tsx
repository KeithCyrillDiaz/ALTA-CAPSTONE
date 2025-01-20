import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { BurgerIcon } from "../components";
import { useDeviceType } from "../hooks/useDeviceType";


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
            <div className="container tabs">
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
           
            <button className="primary" onClick={() => navigate('/')}>Join us</button>
        </div>
    );
};

const Menu: React.FC = () => {

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <>
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

        <div onClick={() => setShowMenu(!showMenu)}>
            <BurgerIcon/>
        </div>
        </>
    )
}


const Header: React.FC= () => {
    
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


interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
}) => {
    return (
        <div>
            <Header/>
            <div className="container">
                {children}
            </div>
        </div>
    )
}

export default MainLayout;