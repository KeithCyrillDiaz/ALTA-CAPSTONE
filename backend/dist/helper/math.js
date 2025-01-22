"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caclucateIncreasePercentage = void 0;
const caclucateIncreasePercentage = (previousValue, currentValue) => {
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    return percentage;
};
exports.caclucateIncreasePercentage = caclucateIncreasePercentage;
//# sourceMappingURL=math.js.map