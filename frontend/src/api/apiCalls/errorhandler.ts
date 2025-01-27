import { AxiosError } from "axios";

const errorHandler = (error: unknown) => {
    // CHECK IF THE ERROR IS AN INSTANCE OF AXIOS ERROR
    if (error instanceof AxiosError) {
      if (error.response) {
        console.log("Response data: ", JSON.stringify(error.response.data.message, null, 2));
      } else {
        console.log("No response data available");
      }

      return null;
    } else {
      // Handle other types of errors (non-AxiosError)
      console.error("Unknown error:", error);
      return null;
    }
}

export default errorHandler;