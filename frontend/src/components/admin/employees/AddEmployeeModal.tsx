import React, { FormEvent, useState } from "react"
import { ModalLayout } from "../../../layouts"
import { Input } from "../../Input"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { useDispatch } from "react-redux"
import { EmployeeDataTypes } from "../../../pages/admin/Employees/Employees"
import { updateEmployeeEditableForm } from "../../../redux/slice/admin/emplooyeSlice"
import CloseIcon from "../../icons/CloseIcon"
import { DropDown } from "../../DropDown"
import { genderData } from "../../../constant/data"
import { BirthdayField } from "../../BirthdayField"
import { FormValue } from "../../client/JobForm"
import { saveEmployee } from "../../../api/apiCalls/admin/employees"
import Loader from "../../Loader"
import { CustomModal } from "../../modal/CustomModal"
import { CheckBoxContainer } from "../../CheckBox"
import { getCityData } from "../../../constant/json"


interface ModalTypes {
    title: string;
    message: string;
    showModal: boolean;
    type: "confirmation" | null;
    navigate?: string | null
}
interface AddEmployeeModalProps {
    visible: boolean,
    onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
    visible,
    onClose
}) => {
    const form = useSelector((state: RootState) => state.adminEmployee.editableForm);
    const dispatch = useDispatch();
 
    const [loading, setLoading] = useState<boolean>(false);
    const [modalDetails, setModalDetails] = useState<ModalTypes>({
        title: "",
        message: "",
        showModal: false,
        type: null,
        navigate: null
    })


    const handleUpdateForm = (field: keyof EmployeeDataTypes, value: FormValue) => {
        dispatch(updateEmployeeEditableForm({field, value}));
    }


    

    const handleSubmitConfirmation = (e: FormEvent) => {
        e.preventDefault();

        setModalDetails({
            type: "confirmation",
            title: "Confirm Submission",
            message: "Are you sure you want to submit the Employee details? Please review all fields before proceeding.",
            showModal: true
        });
    }

    const handleSubmit = async () => {
        if(!form) {
            console.log("Form Not Found");
            return;
        }
        setLoading(true);
        await saveEmployee(form);
        setLoading(false);
        setModalDetails({
            type: null,
            title: "Submission Successful",
            message: "The employee details have been successfully submitted!",
            showModal: true,
            navigate: "reload",
        });
    }

    if(loading) {
        <ModalLayout>
             <div className="feedContentContainer mt-[-100px] relative">
                <Loader/>
             </div>
        </ModalLayout>
    }

    if(form)
    return(
        <>
            {modalDetails.showModal ? (
                <>
                    <CustomModal
                    title={modalDetails.title}
                    message={modalDetails.message}
                    visible={modalDetails.showModal}
                    type={modalDetails.type}
                    onClickConfirm={handleSubmit}
                    onClose={() => {
                        setModalDetails((prev) => ({
                            ...prev,
                            showModal: false
                        }));

                        if(modalDetails.navigate === "reload") {
                            window.location.reload();
                            return  
                        }
                    }}
                    />
                </>
            ) : (
                <>
                {visible && (
                <ModalLayout>
                    <div className="feedContentContainer mt-[-100px] relative">
                        <h3><strong>Personal Information</strong></h3>
                        <div onClick={onClose}
                        className="absolute right-4 top-4 scale-125 hover:scale-150 transition-transform duration-300 cursor-pointer">
                            <CloseIcon/>
                        </div>
                       <form className="flex flex-col gap-2" onSubmit={handleSubmitConfirmation}>
                        <div className="form-row">
                                <Input
                                    onChange={(text) => handleUpdateForm("givenName", text)}
                                    value={form.givenName}
                                    placeholder={"e.g. Keith Cyrill"}
                                    label={"Given Name"}
                                    required={true}
                                    type={"text"}
                                />
                                <Input
                                    onChange={(text) => handleUpdateForm("lastName", text)}
                                    value={form.lastName}
                                    placeholder={"e.g. Diaz"}
                                    label={"Last Name"}
                                    required={true}
                                    type={"text"}
                                />
                            </div>

                            {/* GENDER AND BIRTHDAY*/}
                            <div className="form-row">
                                <div className="inputContainer">
                                    <p className="secondary-text"><strong>Gender</strong></p>
                                    <DropDown
                                    onChange={(value) => handleUpdateForm("gender", value)}
                                    placeHolder="Select Gender"
                                    data={genderData}
                                    />
                                </div>
                                <div className="inputWithLabelContainer">
                                    <p className="secondary-text"><strong>Birthday</strong></p>
                                    <BirthdayField
                                    onChange={(date) => handleUpdateForm("birthday", date)}
                                    value={form.birthday}  
                                    
                                    />
                                </div>
                            </div>

                            {/* EMAAIL AND PHONE NUMBER */}
                            <div className="form-row">
                                <Input
                                    onChange={(text) => handleUpdateForm("email", text)}
                                    value={form.email}
                                    placeholder={"e.g. example@gmail.com"}
                                    label={"Email"}
                                    required={true}
                                    type={"email"}
                                />
                                <Input
                                    onChange={(text) => handleUpdateForm("phoneNumber", text)}
                                    value={form.phoneNumber}
                                    placeholder={"e.g. 09391231234"}
                                    label={"Phone No."}
                                    required={true}
                                    type={'tel'}
                                />
                            </div>

                            {/* CURRENT CITY AND SALARY */}
                            <div className="form-row">
                                 <div className="inputContainer">
                                    <p className="secondary-text"><strong>Current City</strong></p>
                                    <DropDown
                                        search
                                        data={getCityData()}
                                        placeHolder={"e.g. Las Pinas City"}
                                        onChange={(value) => handleUpdateForm("currentCity", value)}
                                        value={form.currentCity}
                                    />
                                </div>
                                <Input
                                    onChange={(text) => handleUpdateForm("salary", text)}
                                    value={form.salary}
                                    placeholder={"e.g. 27000"}
                                    label={"Salary"}
                                    required={true}
                                    type={"number"}
                                />
                            </div>

                            {/* COMPANY EMAIL AND POSITION */}
                            <div className="form-row">
                                <Input
                                    onChange={(text) => handleUpdateForm("companyEmail", text)}
                                    value={form.companyEmail}
                                    placeholder={"e.g. keithalbarinadiaz@gmail.com"}
                                    label={"Company Email"}
                                    required={true}
                                    type={"email"}
                                />
                            <Input
                                    onChange={(text) => handleUpdateForm("position", text)}
                                    value={form.position}
                                    placeholder={"e.g. Software Engineer"}
                                    label={"Position"}
                                    required={true}
                                    type={"text"}
                                />
                            </div>

                           <div className="flex justify-center mt-2">
                                <CheckBoxContainer
                                    onClick={(value) => handleUpdateForm("workOnsite", value)}
                                    label="Willing to work on-site"
                                    value={form.workOnsite}
                                />
                           </div>

                            <div className="flex items-center gap-2 justify-center mt-4">
                                <button type="submit" className="primary">
                                    Add
                                </button>
                                <button type="button" onClick={onClose} className="secondary">
                                    Cancel
                                </button>
                            </div>
                       </form>
                    </div>
                </ModalLayout>
            )}
                </>
            )}
        </>
    )
}

export default AddEmployeeModal