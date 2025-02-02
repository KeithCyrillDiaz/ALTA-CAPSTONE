import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import { HeroSection } from "../../../components/admin/HeroSection";
import { Loader } from "../../../components";
// import { Options } from "../../../components/admin/Options";
// import { clearAdminJobFilter, searchAdminJobFilter} from "../../../redux/slice/admin/jobSlice";
import { TableDataTypes } from "../../../components/admin/table/Table";
import { AdminFilter } from "../../../components/admin/AdminFilterModal";

import { RootState } from "../../../redux/store";
import { getEmployees} from "../../../api/apiCalls/admin/employees";
import { setAdminEmployeesData, setEmployeeEditableForm} from "../../../redux/slice/admin/emplooyeSlice";
import { EmployeeTable } from "../../../components/admin/employees/EmployeeTable";
import AddEmployeeModal from "../../../components/admin/employees/AddEmployeeModal";



export interface EmployeeDataTypes {
    givenName: string;
    lastName: string;
    birthday: Date | null;
    gender: string; 
    email: string;
    phoneNumber: string; 
    currentCity: string;
    salary: number; 
    companyEmail: string;
    position: string;
    workOnsite: boolean;
}



const Employees: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState<boolean>(false);


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.adminEmployee.filteredEmployeesData);

    const newForm: EmployeeDataTypes = useMemo(() => ({
        givenName: "",
        lastName: "",
        birthday: null,
        gender: "",
        email: "",
        companyEmail: "",
        phoneNumber: "",
        currentCity: "",
        salary: 0,
        position: "",
        workOnsite: false,
    }),[])

          
    const handleAddEmployeeModalClose = () => {
        dispatch(setEmployeeEditableForm(newForm));
        setShowAddEmployeeModal(false)
    }
   
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getEmployees();
            dispatch(setAdminEmployeesData(data));
            dispatch(setEmployeeEditableForm(newForm));
            setLoading(false);
        }
        fetchData();
    },[dispatch, newForm]);


    return (
        <AdminLayout title="EMPLOYEES">
             <div className="flex flex-col justify-center gap-4 relative pb-12">
                <HeroSection/>
                <main>
                    {loading ? (
                        <Loader/>
                    ) : (
                        <div className="container flex flex-col gap-2">
                            <div className="flex items-center justify-end gap-2">
                                {/* <Options
                                onChangeSearchText={(text) => dispatch(searchAdminJobFilter(text))}
                                onFilterClick={() => setShowFilterModal(!showFilterModal)}
                                onSearchClick={() =>{}} //TO AVOID ERRORS
                                onClickClearFilter={() => dispatch(clearAdminJobFilter())}
                                /> */}
                                <button onClick = {() => setShowAddEmployeeModal(true)} className="primary">+ Add Employee</button>
                            </div>
                            {employees && <EmployeeTable   
                            onClickView={(id) => navigate(`/admin/jobs/view/${id}`)} 
                            tableData={employees as TableDataTypes[]}/>}
                        </div>
                    )}
                </main>        
            </div>
             <AdminFilter
            visible={showFilterModal}
            type="Jobs"
            onClickCancel={() => setShowFilterModal(false)}
            />

            <AddEmployeeModal
            visible = {showAddEmployeeModal}
            onClose = {handleAddEmployeeModalClose}
            />
        </AdminLayout>
    )
}


export default Employees;