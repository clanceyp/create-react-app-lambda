import React from "react";
import { SuggestionItem } from "./SuggestionItem";


export const AutoSuggestList = ({suggestions, isShow, onClick, activeIndex}) => {
    if (suggestions.length && isShow) {
        return (
            <ul className="autocomplete">
                <li>{suggestions.length}</li>
                {suggestions.map((suggestion, index) => {
                    const isActive = (index + 1) === activeIndex;
                    return (<SuggestionItem
                        index={index}
                        isActive={isActive}
                        suggestion={suggestion}
                        onClick={onClick} />)
                })}
            </ul>
        );
    } else if (isShow && suggestions.length === 0) {
        return (
            <div className="no-autocomplete">
                <em>Sorry no suggestions found</em>
            </div>
        );
    }
    return <p></p>;
}
