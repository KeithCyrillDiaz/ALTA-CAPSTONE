import { SearchIcon } from "../icons/SearchIcon";



interface SearchProps {
    onChangeText: (value: string) => void;
    onClick: () => void;
}

export const Search: React.FC<SearchProps> = ({
    onChangeText,
    onClick
}) => {
    return(
        <div className="search">
            <div className="searchContainer">
                <input 
                placeholder="Search"
                onChange={(e) => onChangeText(e.target.value)}/>
                <div onClick={onClick}>
                    <SearchIcon/>
                </div>
            </div>
        </div>
    )
}