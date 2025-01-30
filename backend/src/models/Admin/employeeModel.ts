import mongoose from "mongoose";

//This is for data structure for mognodb

const employeeSchema = new mongoose.Schema ({

    // Personal Information
    givenName: {type: String, required: true},
    lastName: {type: String, required: true},
    birthday: {type: Date, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    currentCity: {type: String, required: true},
    salary: {type: Number},
    companyEmail: {type: String},
    position: {type: String, required: true},
    workOnsite: {type: Boolean, required: true},

    //TimeStamp for filter
    month: {type: String, required: true},
    year: {type: Number, required: true},

}, {timestamps: true})


export const EmployeeModel = mongoose.model('Employee', employeeSchema);
