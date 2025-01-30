"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//This is for data structure for mognodb
const employeeSchema = new mongoose_1.default.Schema({
    // Personal Information
    givenName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    currentCity: { type: String, required: true },
    salary: { type: Number },
    companyEmail: { type: String },
    position: { type: String, required: true },
    workOnsite: { type: Boolean, required: true },
    //TimeStamp for filter
    month: { type: String, required: true },
    year: { type: Number, required: true },
}, { timestamps: true });
exports.EmployeeModel = mongoose_1.default.model('Employee', employeeSchema);
//# sourceMappingURL=employeeModel.js.map