
export const monthArray = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

export const getDateToday = () => {
    const dateToday = new Date();
    const month = dateToday.getMonth();
    const day = dateToday.getDate();
    const year = dateToday.getFullYear();

    // console.log(`month: ${monthArray[month]}, day: ${day}, year: ${year}, fullDate: ${dateToday}`);

    return {
        month: monthArray[month],
        day,
        year,
        dateToday
    }
}