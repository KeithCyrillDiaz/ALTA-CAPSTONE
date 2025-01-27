import React, { FormEvent, useState } from "react";
import { adminLogin } from "../../api/apiCalls/admin";
import { useNavigate } from "react-router-dom";
import { CustomModal } from "../../components/modal/CustomModal";

export interface FormStateTypes  {
    username:string; 
    password: string;
}

const Login: React.FC = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState<FormStateTypes>({
        username: "",
        password: ""
    });

    const [modalDetails, setModalDetails] = useState({
        title: "",
        message: "",
        showModal: false
    })

    const handleUpdateForm = (field: keyof FormStateTypes, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Submitting Form");

        console.log(JSON.stringify(form, null, 2));
        const result = await adminLogin(form);
        if(!result){ 
            setModalDetails({
                title: "Incorrect Credentials",
                message: "The username or password you entered is incorrect. Please try again.",
                showModal: true,
            });
            return;
        }
        navigate('/admin/dashboard');
    }

    return (
        <div className="admin-login">
            <CustomModal
            title={modalDetails.title}
            message={modalDetails.message}
            visible={modalDetails.showModal}
            onClose={() => setModalDetails((prev) => ({
                ...prev,
                showModal: false
            }))}
            />
            <div className="admin-login-container">
                <h1 className="text-white">ALTA CELESTIA ADMIN</h1>

                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                            <input 
                                placeholder="username"
                                onChange={(e) => handleUpdateForm("username", e.target.value)}
                                value={form.username}
                                required
                            />
                    </div>
                    <div className="inputContainer">
                            <input 
                                    type="password"
                                    placeholder="password"
                                    onChange={(e) => handleUpdateForm("password", e.target.value)}
                                    value={form.password}
                                    required
                            />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="secondary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login