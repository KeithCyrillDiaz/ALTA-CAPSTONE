"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateToday = exports.monthArray = void 0;
exports.monthArray = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const getDateToday = () => {
    const dateToday = new Date();
    const month = dateToday.getMonth();
    const day = dateToday.getDate();
    const year = dateToday.getFullYear();
    // console.log(`month: ${monthArray[month]}, day: ${day}, year: ${year}, fullDate: ${dateToday}`);
    return {
        month: exports.monthArray[month],
        day,
        year,
        dateToday
    };
};
exports.getDateToday = getDateToday;
//# sourceMappingURL=date.js.map