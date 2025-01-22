import { useEffect, useState } from "react";



const useDeviceType = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsTablet(window.innerWidth >= 768);
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return {
        isMobile,
        isTablet,
        isDesktop,
    }

}


export default useDeviceType;