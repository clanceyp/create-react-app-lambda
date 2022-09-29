import React from "react"
import "./Foo.scss"
import { PRIMARY_API } from "../../Constants"

const foobar = (url) => {
    const API = `${PRIMARY_API.baseURL}/recipes/random?maxCarbs=20&number=2&type=vegan`;
    fetch(API, {
        method: 'GET',
        headers: {
            "x-api-key": PRIMARY_API.apiKey,
            Accept: 'application/json',
        },
    }).then(response => response.json())
        .then(json => document.querySelector('.foo').innerText = JSON.stringify(json))
}

export function Foo() {
    const userActions = {
        onClick : foobar
    }
    return <button className="foo" {...userActions}>It's my test</button>
}
