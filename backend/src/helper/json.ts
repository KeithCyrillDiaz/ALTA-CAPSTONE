export const removeTrailingCommas = (jsonString: string) => {
    // REMOVE BACKTICKS AND NEWLINES SURROUNDING THE JSON
    jsonString = jsonString.replace(/^```json\n|\n```$/g, ''); 
    
    // REMOVE TRAILING COMMAS IN ARRAYS AND OBJECTS
    return jsonString.replace(/,(\s*[}\]])/g, '$1');
}