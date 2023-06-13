import {BrowserRouter as Router, Link} from "react-router-dom";
import React from "react";


export const Nav = () => {
    return (
    <Router>
        <nav>
            <ul>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
    </Router>)
}
