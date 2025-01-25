import React, { useEffect } from "react";
import { ModalLayout } from "../../layouts";
import { useModal } from "../../hooks";

interface CustomModal {
    title: string;
    message: string;
    visible: boolean
    onClose: () => void;
    type?: 'confirmation' | null;
    confirmLabel?: string
    cancelLabel?: string;
    onClickConfirm?: () => void;
}
export const CustomModal:React.FC<CustomModal> = ({
    title,
    message,
    visible,
    onClose,
    type = null,
    confirmLabel = "Yes",
    cancelLabel = "No",
    onClickConfirm = () => {}
}) => {

    const {setIsModalOpen} = useModal();

    useEffect(() => {
        setIsModalOpen(!visible);
    },[visible, setIsModalOpen])

    return (
        <>
            {visible && (
                <ModalLayout>
                    <div className="">
                        <div className="flex justify-center py-2 border-b-2 border-b-gray">{title}</div>
                        <div className="flex justify-center p-4 border-b-2 border-b-gray">{message}</div>
                        <div className="flex justify-center p-2 gap-4">
                            {type === "confirmation" ? (
                                <>
                                    <button className="primary" onClick={onClickConfirm}>{confirmLabel}</button>
                                    <button className="secondary" onClick={onClose}>{cancelLabel}</button>
                                </>
                            ) : (
                                <button className="primary" onClick={onClose}>Close</button>
                            )}
                        </div>
                    </div>
                </ModalLayout>
            )}
        </>
    )
}