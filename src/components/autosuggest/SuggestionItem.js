import React from "react";
import classNames from "classnames";

import './SuggestionItem.scss';

export const SuggestionItem = ({index, suggestion, onClick, isActive}) => {
    const classes = classNames({
        '--active': isActive,
    });
    return (
        <button role={'listitem'}
                className={classes}
                data-index={index}
                key={suggestion.uid}
                onClick={onClick}>
            {suggestion.name}
        </button>
    )
}
