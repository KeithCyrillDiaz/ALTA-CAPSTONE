import React, { useRef } from "react"
import { CalendarIcon } from "./icons/CalendarIcon"
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // CSS for the calendar

interface BirthdayFieldProps {
    onChange: (date: Date | null) => void;
    value?: Date | null,
    required?: boolean
}
export const BirthdayField:React.FC<BirthdayFieldProps> = ({
    onChange,
    value,
    required = false
}) => {

    const datePickerRef = useRef<DatePicker | null>(null);

    const openDatePicker = () => {
        //OPEN THE DATE PICKER
        if (datePickerRef.current) {
          datePickerRef.current.setFocus(); // THIS OPENS THE DROPDOWN
        }
      };
    return(
        <div className="inputWithIconContainer">
             <DatePicker
                ref={datePickerRef}
                className='bday-dropdown'
                selected={value}
                onChange={(date) => onChange(date)}
                placeholderText='Birthday'
                dateFormat="yyyy-MM-dd" 
                maxDate={new Date()} // PREVENT FUTURE DATES
                showYearDropdown
                scrollableYearDropdown
                showMonthDropdown
                dropdownMode="select"
                required={required}
                />
            <div onClick={openDatePicker}>
                <CalendarIcon/>
            </div>
        </div>
    )
}