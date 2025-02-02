import React from "react"
import { ModalLayout } from "../../../layouts"
import { Input } from "../../Input"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { useDispatch } from "react-redux"
import { EmployeeDataTypes } from "../../../pages/admin/employees/Employees"
import { updateEmployeeEditableForm } from "../../../redux/slice/admin/emplooyeSlice"

interface AddEmployeeModalProps {
    visible: boolean
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
    visible,
}) => {
    const form = useSelector((state: RootState) => state.adminEmployee.editableForm);
    const dispatch = useDispatch();


    const handleUpdateForm = (field: keyof EmployeeDataTypes, value: string | number | boolean) => {
        dispatch(updateEmployeeEditableForm({field, value}));
    }
    if(form)
    return(
        <>
            {visible && (
                <ModalLayout>
                    <div className="feedContentContainer mt-[-100px]">
                        <h3><strong>Personal Information</strong></h3>
                        <div className="form-row">
                            <Input
                                onChange={(text) => handleUpdateForm("givenName", text)}
                                value={form.givenName}
                                placeholder={"e.g. Keith Cyrill"}
                                label={"Given Name"}
                                required={true}
                                type={"text"}
                                />
                        </div>
                    </div>
                </ModalLayout>
            )}
        </>
    )
}

export default AddEmployeeModal