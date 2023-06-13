import React, { MouseEventHandler } from "react";
import classNames from "classnames";

import './SuggestionItem.scss';

export interface SuggestionState {
    [key: string]: any,
    name: string,
    uid?: string | undefined,
    id?: string | undefined
}

type Props = {
    onClick: MouseEventHandler,
    index: number,
    suggestion: SuggestionState,
    activeIndex: number,
}

export const  SuggestionItem = ({index, suggestion, onClick, activeIndex}: Props) => {
    const isActive: boolean = (index + 1) === activeIndex;
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
