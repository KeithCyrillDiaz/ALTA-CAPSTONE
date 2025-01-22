"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const totalSchema = new mongoose_1.default.Schema({
    totalApplicants: { type: Number, required: true },
    totalJob: { type: Number, required: true },
    totalEmployees: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
}, { timestamps: true });
totalSchema.index({ month: 1, year: 1 });
exports.TotalModel = mongoose_1.default.model("totalCount", totalSchema);
//# sourceMappingURL=totalCountModel.js.map