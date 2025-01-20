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
            <div className="inputContainer">
                <input 
                onChange={(e) => onChangeText(e.target.value)}/>
                <SearchIcon/>
            </div>
   
            <button onClick={onClick} className="primary">Search</button>
        </div>
    )
}