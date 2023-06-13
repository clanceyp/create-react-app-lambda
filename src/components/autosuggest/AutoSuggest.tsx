import React, {MouseEventHandler, useState} from "react";
import axios from "axios";
import {
    hash
} from "../../js/Utils";
import {
    AutoSuggestList,
} from "./AutoSuggestList";

import {
    SuggestionState
} from "./SuggestionItem";

type PropsAutoSuggest = {
    getAutocompleteUrl: Function,
    setHasError: any,
    autocompleteConfig: {
        url: string
    },
    getGlycaemicLoad: any
}

interface ResponseObj {
    data: object[]
}

interface MenuItemMap {
    name: string,
    uid?: string
}

const AutoSuggest = ({getAutocompleteUrl, setHasError, autocompleteConfig, getGlycaemicLoad}: PropsAutoSuggest) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [suggestions, setSuggestions] = useState(new Array<SuggestionState>());
    const [suggestionsHistory, setSuggestionsHistory] = useState({});
    const [isShow, setIsShow] = useState(false);
    const [input, setInput] = useState('');
    const handleAutoCompleteUpdate = (response: ResponseObj, userInput: string) => {
        const items: MenuItemMap[] = [];
        const history: object = Object.assign({}, suggestionsHistory);
        // @ts-ignore
        response.data.forEach( (el: MenuItemMap) => items.push( {...el} ) );
        items.forEach((el: Record<string, any>) => el.uid = hash(el.name) );
        setActiveIndex(0);
        // @ts-ignore
        setSuggestions( items );
        setIsShow(true);
        // @ts-ignore
        history[userInput] = items;
        setSuggestionsHistory(history);
    }

    const onInput = (e: any) => {
        const userInput = e.currentTarget.value;
        if (userInput.length < 4 || userInput === input) {
            setIsShow(false);
            return;
        }
        // @ts-ignore
        if (suggestionsHistory[userInput]) {
            setActiveIndex(0);
            // @ts-ignore
            setSuggestions( suggestionsHistory[userInput] );
            setIsShow(true);
        } else {
            autocompleteConfig.url = getAutocompleteUrl(userInput);
            axios(autocompleteConfig)
                .then((request) => {
                    console.log('got request', request);
                    handleAutoCompleteUpdate(request, userInput)
                }).catch(() => {
                setHasError(true);
            })
        }
    };
    const onClick = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        const index: any = target.dataset.index;
        if (!index) {
            console.error("Missing index value in data");
            return;
        }
        const ingredient = suggestions[index].name;
        setActiveIndex(0);
        setSuggestions([]);
        setIsShow(false);
        setInput(ingredient);
        getGlycaemicLoad(ingredient);
        document
            .querySelectorAll('.ingredient-search-input')
            .forEach( (el: any) => el.value = ingredient );

    };
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const ingredient = suggestions[activeIndex].name;
            setActiveIndex(0);
            setIsShow(false);
            setInput(ingredient);
            document
                .querySelectorAll('.ingredient-search-input')
                .forEach((el: any) => el.value = ingredient );
        } else if (e.key === "ArrowUp") {
            return (activeIndex === 0) ? null : setActiveIndex(activeIndex - 1);
        } else if (e.key === "ArrowDown") {
            return (activeIndex === suggestions.length) ? null : setActiveIndex(activeIndex + 1);
        }
    };
    return (
        <section>
            <h2 className={'text-3xl font-bold underline'}>What's the top carb ingredient in your next meal?</h2>
            <input
                type="text"
                placeholder={'Wheat flour'}
                onInput={onInput}
                onKeyDown={onKeyDown}
                className={'ingredient-search-input text-3xl font-bold underline'}
            />
            <AutoSuggestList
                suggestions={suggestions}
                isShow={isShow}
                onClick={onClick}
                activeIndex={activeIndex} />
        </section>
    );
}


export default AutoSuggest
