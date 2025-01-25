import { FormValue } from "../components/JobForm";

export const validatePhoneNumber = (value: FormValue) =>{
        // REGEX TO CHECK IF THE VALUE CONTAINES Regex to check if the value contains non-numeric characters
        const regex = /[^0-9]/;
        if (typeof value === "string" && regex.test(value)) {
            console.log("Invalid phone number: contains non-numeric characters");
            return false; 
        }

        return true;
}

export const validateEmail = (value: FormValue) => {
    //RETURN FALSE AS SOON AS THE VALUE IS NOT STRING
    if(typeof(value) !== "string") {
        console.log("Value must be a string")
        return false;
    }

    // THIS CHECK IF THE EMAIL IS VALID
    if(
         value.includes("@") &&
        (value.endsWith(".com") || value.endsWith(".ph")) &&
        (value.match(/\.com/g) || []).length <= 1 && // ENSURE THERE'S ONLY ONE ".com"
        (value.match(/\.ph/g) || []).length <= 1 // ENSURE THERE'S ONLY ONE ".ph"
    ) {
        //IF VALID RETURN TRUE
        return true
    }

    return false
}