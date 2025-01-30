import React from "react";
import { Search } from "../client/Search";
import { useDispatch } from "react-redux";
import { clearFilter } from "../../redux/slice/admin/applicationsSlice";

interface OptionsProps {
    onFilterClick: () => void;
    onChangeSearchText: (text: string) => void;
    onSearchClick: () => void;
}

export const Options:React.FC<OptionsProps> = ({
    onFilterClick,
    onChangeSearchText,
    onSearchClick
}) => {

    const dispatch = useDispatch();

    const handleClearFilter = () => {
        dispatch(clearFilter());
    }
    return (
        <div className="flex justify-end gap-2">
            <Search 
            placeholder="Search" 
            onChangeText={(text) => onChangeSearchText(text)} 
            onClick={onSearchClick}
            />
            <button onClick={onFilterClick} className="primary">Filter Data</button>
            <button onClick={handleClearFilter} className="secondary">Clear Filter</button>
        </div>
    )
}