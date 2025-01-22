import { DropDownDataType } from "../components/DropDown";



export const formatDropDownData = (data: string[]): DropDownDataType[] => {
    const formattedDropDownData: DropDownDataType[] = data.map((item) => {
        const format = {
            value: item,
            label: item
        };
        //RETURN THE FORMAT TO ADD THE NEW ARRAY CREATED BY MAP METHOD
        return format;
    })
    
    return formattedDropDownData;
}