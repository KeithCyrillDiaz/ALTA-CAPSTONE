"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caclucateIncreasePercentage = void 0;
const caclucateIncreasePercentage = (previousValue, currentValue) => {
    // CHECK IF PREV VALUE IS 0, IF YES RETURN 0
    if (previousValue === 0)
        return 0;
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    ;
    return Math.ceil(percentage);
};
exports.caclucateIncreasePercentage = caclucateIncreasePercentage;
//# sourceMappingURL=math.js.map