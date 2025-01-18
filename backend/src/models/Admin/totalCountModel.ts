import mongoose from "mongoose";

const totalSchema = new mongoose.Schema({
    totalApplicants: {type: Number, required: true},
    totalJob: {type: Number, required: true},
    totalEmployees: {type: Number, required: true},

    month: {type: String, required: true},
    year: {type: Number, required: true},
}, {timestamps: true});

totalSchema.index({month: 1, year: 1});

export const TotalModel = mongoose.model("totalCount", totalSchema);