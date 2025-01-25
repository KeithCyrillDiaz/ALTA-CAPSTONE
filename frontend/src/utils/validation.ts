import { FormValue, JobApplicationFormTypes } from "../components/JobForm";

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


export const checkForm = (form: JobApplicationFormTypes, ): boolean => {

    // LIST OF KEYS REQUIRED TO CHECK
    const keysToCheck: (keyof JobApplicationFormTypes)[] = [
      'givenName',
      'lastName',
      'birthday',
      'gender',
      'email',
      'phoneNumber',
      'currentCity',
      'expectedSalary',
      'resumeString',
      'jobId',
      'jobTitle',
      'company',
      'workOnsite',
    ];
  
    //ITERATE TO EVERY KEYSTOCHECK AND CHECK IF THE THE VALUE IS NOT EQUAL TO ""
    const isFormDataValid = keysToCheck.every((key) => {
      const value = form[key];
      console.log(`key ${key} value: ${value}`);
      return value !== "" && (key !== 'birthday' || value !== null);
    });

    console.log("isFormDataValid", isFormDataValid)
  
    //DETERMINE IF THE FORM IS VALID BASED ON THE CHECKS 
    if (isFormDataValid) {
      return true; // RETURN TRUE IF VALID
    } else {
      return false; // RETURN FALSE IF NOT
    }
  };