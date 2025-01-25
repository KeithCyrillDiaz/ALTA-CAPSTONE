"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailingCommas = void 0;
const removeTrailingCommas = (jsonString) => {
    // REMOVE BACKTICKS AND NEWLINES SURROUNDING THE JSON
    jsonString = jsonString.replace(/^```json\n|\n```$/g, '').trim();
    // REMOVE EXTRA BACKSLASHES OR ESCAPE SEQUENCES (if any)
    jsonString = jsonString.replace(/\\[rn\\]/g, '').trim(); // Example: remove extra backslashes or newline escapes
    // REMOVE TRAILING COMMAS IN ARRAYS AND OBJECTS
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
    return jsonString;
};
exports.removeTrailingCommas = removeTrailingCommas;
//# sourceMappingURL=json.js.map