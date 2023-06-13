import React, {MouseEventHandler} from "react"
import "./Glycaemic.scss"

type PropForm = {
    gIndex: {
        glycemicIndex: number,
        original: string
    },
    gLoad: string
}
type PropGetGI = {
    getGlycaemicLoad: MouseEventHandler;
}
type PropFormGetGI = PropForm & PropGetGI;
type PropIngredient = {
    original: string,
    glycemicLoad?: number,
    glycemicIndex?: number,
}
type PropExtendedIngredients = {
    extendedIngredients: PropIngredient[],
}
type PropIng = {
    ingredient: PropIngredient
}

export const IngredientsList = ({ extendedIngredients }: PropExtendedIngredients) => {
    return (
        <ul>
            {extendedIngredients
                .map( (ingredient: PropIngredient) => (
                    <Ingredient
                        key={ingredient.original}
                        ingredient={ingredient} />
                ))}
        </ul>
    );
};

const Ingredient = ({ ingredient }: PropIng) => {
    return (
        <li>
            <strong>{ingredient.original}</strong>
            &nbsp;
            <span>{ingredient.hasOwnProperty('glycemicIndex') ? ingredient.glycemicIndex?.toString() : ''}</span>
            <span className={'--brackets'}>{ingredient.glycemicLoad || ''}</span>
        </li>
    );
};

export const GetGIForm = ({getGlycaemicLoad, gIndex, gLoad}: PropFormGetGI) => {
    return (
        <div className={'form-glycemic-info'}>
            <h2>Get Glycaemic Info</h2>
            <button onClick={getGlycaemicLoad}>Info</button>
            <ShowGlycaemicInfo
                gIndex={gIndex}
                gLoad={gLoad} />
        </div>
    );
}

export const ShowGlycaemicInfo = ({gIndex, gLoad}: PropForm) => {
    if (!gIndex?.glycemicIndex) {
        return <p>Sorry, we don't have glycemic info for this item. Please choose something similar.</p>;
    }
    return (
        <dl>
            {gIndex?.glycemicIndex && (
                <>
                    <dt>Top ingredient glycaemic index</dt>
                    <dd><strong>{gIndex.glycemicIndex}</strong> ({gIndex.original})</dd>
                </>
            )}
            {gLoad && (
                <>
                    <dt>Total Glycaemic Load:</dt>
                    <dd><strong>{gLoad}</strong> (per serving)</dd>
                </>
            )}
        </dl>)
}
