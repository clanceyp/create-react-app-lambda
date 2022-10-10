import React from "react";

export const AutoSuggestList = ({suggestions, isShow, onClick, activeIndex}) => {
    if (suggestions.length && isShow) {
        return (
            <ul className="autocomplete">
                {suggestions.map((suggestion, index) => {
                    const isActive = (index + 1) === activeIndex
                    return (
                        <button role={'listitem'}
                                className={ isActive ? '--active' : ''}
                                data-index={index}
                                key={suggestion.uid}
                                onClick={onClick}>
                            {suggestion.name}
                        </button>
                    );
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