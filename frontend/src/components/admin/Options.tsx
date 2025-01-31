import React from "react";
import { Search } from "../client/Search";

interface OptionsProps {
    onFilterClick: () => void;
    onChangeSearchText: (text: string) => void;
    onSearchClick: () => void;
    onClickClearFilter: () => void;
}

export const Options:React.FC<OptionsProps> = ({
    onFilterClick,
    onChangeSearchText,
    onSearchClick,
    onClickClearFilter
}) => {


    return (
        <div className="flex justify-end gap-2">
            <Search 
            placeholder="Search" 
            onChangeText={(text) => onChangeSearchText(text)} 
            onClick={onSearchClick}
            />
            <button onClick={onFilterClick} className="primary">Filter Data</button>
            <button onClick={onClickClearFilter} className="secondary">Clear Filter</button>
        </div>
    )
}