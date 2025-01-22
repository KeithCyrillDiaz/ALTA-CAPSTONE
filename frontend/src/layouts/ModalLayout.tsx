import React from "react";



const ModalLayout:React.FC<{children: React.ReactNode}> = ({children}) => {
    return(
        <div className="modalLayoutContainer">
            <div className="modal">
                {children}
            </div>
        </div>
    )
}


export default ModalLayout