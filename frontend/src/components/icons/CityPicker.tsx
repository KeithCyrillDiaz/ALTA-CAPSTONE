import React from "react"
import { ModalLayout } from "../../layouts"

interface CityPicker {
    
}

export const CityPicker: React.FC = () => {
    return(
         <>
            {visible && (
                <ModalLayout>
                    <div>
                        <div>{title}</div>
                        <div>{message}</div>
                        <div>
                            <button className="primary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </ModalLayout>
            )}
        </>
    )
}