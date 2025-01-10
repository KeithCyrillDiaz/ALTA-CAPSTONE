import { error } from "console"


export const logger = {
    event: (message: string) => console.log("Event - ".magenta + message + "..."),
    error: (message: string, errorDetails?: any) => {
        console.log("Error - ".red + message);
        if(errorDetails) {
            console.log("Details: ".red + JSON.stringify(errorDetails, null, 2));
        }
    },
    ready: (message: string) => console.log("Ready - ".green + message),
    success: (message: string) => console.log("Success - ".yellow + message),
}