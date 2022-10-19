import React from "react"
import "./Glycemic.scss"


export const IngredientsList = ({ extendedIngredients }) => {
    return (
        <ul>
            {extendedIngredients
                .map(ingredient => (
                    <Ingredient
                        key={ingredient.original}
                        ingredient={ingredient} />
                ))}
        </ul>
    );
};

const Ingredient = ({ ingredient }) => {
    return (
        <li>
            <strong>{ingredient.original}</strong>
            &nbsp;
            <span>{ingredient.hasOwnProperty('glycemicIndex') ? ingredient.glycemicIndex.toString() : ''}</span>
            <span className={'--brackets'}>{ingredient.glycemicLoad || ''}</span>
        </li>
    );
};

export const GetGIForm = ({getGlycemicLoad, gIndex, gLoad}) => {
    return (
        <div className={'form-glycemic-info'}>
            <h2>Get Glycemic Info</h2>
            <button onClick={getGlycemicLoad}>Info</button>
            <ShowGlycemicInfo
                gIndex={gIndex}
                gLoad={gLoad} />
        </div>
    );
}

export const ShowGlycemicInfo = ({gIndex, gLoad}) => {
    return (
        <dl>
            {gIndex?.glycemicIndex && (
                <>
                    <dt>Top ingredient glycemic index</dt>
                    <dd><strong>{gIndex.glycemicIndex}</strong> ({gIndex.original})</dd>
                </>
            )}
            {gLoad &&
                <>
                    <dt>Total Glycemic Load:</dt>
                    <dd><strong>{gLoad}</strong> (per serving)</dd>
                </>
            }
        </dl>)
}
