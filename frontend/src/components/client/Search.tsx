import { SearchIcon } from "../icons/SearchIcon";



interface SearchProps {
    onChangeText: (value: string) => void;
    onClick: () => void;
    hideIcon?: boolean
    placeholder?: string;
    value?: string;
}

export const Search: React.FC<SearchProps> = ({
    onChangeText,
    onClick,
    hideIcon = false,
    placeholder = "Search",
    value,
}) => {
    return(
        <div className="search">
            <div className="searchContainer">
                <input 
                placeholder={placeholder}
                onChange={(e) => onChangeText(e.target.value)}
                value={value}
                />
                {!hideIcon && (
                    <div onClick={onClick}>
                    <SearchIcon/>
                </div>
                )}
            </div>
        </div>
    )
}