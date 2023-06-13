import React, { MouseEventHandler } from "react";
import {
    SuggestionItem,
    SuggestionState
} from "./SuggestionItem";


type Props = {
    onClick: MouseEventHandler,
    activeIndex: number,
    isShow: boolean,
    suggestions: SuggestionState[]
}

export const AutoSuggestList = ({suggestions, isShow, onClick, activeIndex}: Props) => {
    if (suggestions.length && isShow) {
        return (
            <ul className="autocomplete">
                {suggestions.map((suggestion, index) => {
                    return (<SuggestionItem
                        key={suggestion?.uid || index}
                        index={index}
                        activeIndex={activeIndex}
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
