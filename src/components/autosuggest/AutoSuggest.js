import React, { useState } from "react";
import axios from "axios";
import {
    hash
} from "../../js/Utils";
import {
    AutoSuggestList
} from "./AutoSuggestList";

const AutoSuggest = ({getAutocompleteUrl, setHasError, autocompleteConfig, getGlycemicLoad}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsHistory, setSuggestionsHistory] = useState({});
    const [isShow, setIsShow] = useState(false);
    const [input, setInput] = useState('');
    const handleAutoCompleteUpdate = (response, userInput) => {
        const items = [];
        const history = Object.assign({}, suggestionsHistory);
        response.data.forEach( el => items.push( {...el} ) );
        items.forEach(el => el.uid = hash(el.name) );
        setActiveIndex(0);
        setSuggestions( items );
        setIsShow(true);
        history[userInput] = items;
        setSuggestionsHistory(history);
    }

    const onInput = e => {
        const userInput = e.currentTarget.value;
        if (userInput.length < 4 || userInput === input) {
            setIsShow(false);
            return;
        }
        if (suggestionsHistory[userInput]) {
            setActiveIndex(0);
            setSuggestions( suggestionsHistory[userInput] );
            setIsShow(true);
        } else {
            console.log('sending userInput', userInput);
            autocompleteConfig.url = getAutocompleteUrl(userInput);
            axios(autocompleteConfig)
                .then((request) => {
                    console.log('got request request', request);
                    handleAutoCompleteUpdate(request, userInput)
                }).catch(() => {
                setHasError(true);
            })
        }
    };
    const onClick = e => {
        const ingredient = suggestions[e.target.dataset.index].name;
        setActiveIndex(0);
        setSuggestions([]);
        setIsShow(false);
        setInput(ingredient);
        getGlycemicLoad(ingredient);
        document
            .querySelectorAll('.ingredient-search-input')
            .forEach(el => el.value = ingredient );

    };
    const onKeyDown = e => {
        if (e.key === "Enter") {
            const ingredient = suggestions[activeIndex].name;
            setActiveIndex(0);
            setIsShow(false);
            setInput(ingredient);
            document
                .querySelectorAll('.ingredient-search-input')
                .forEach(el => el.value = ingredient );
        } else if (e.key === "ArrowUp") {
            return (activeIndex === 0) ? null : setActiveIndex(activeIndex - 1);
        } else if (e.key === "ArrowDown") {
            return (activeIndex === suggestions.length) ? null : setActiveIndex(activeIndex + 1);
        }
    };
    return (
        <section>
            <h2>What's the top carb ingredient in your next meal?</h2>
            <input
                type="text"
                placeholder={'Wheat flour'}
                onInput={onInput}
                onKeyDown={onKeyDown}
                className={'ingredient-search-input'}
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
