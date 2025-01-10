"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    event: (message) => console.log("Event - ".magenta + message + "..."),
    error: (message, errorDetails) => {
        console.log("Error - ".red + message + "...");
        if (errorDetails) {
            console.log("Details: ".red + JSON.stringify(errorDetails, null, 2));
        }
    },
    ready: (message) => console.log("Ready - ".green + message + "..."),
    success: (message) => console.log("Event - ".yellow + message + "..."),
};
//# sourceMappingURL=logger.js.map