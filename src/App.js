import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import axios from "axios";
import { PRIMARY_API } from "./js/Constants";
import {
    sortGI,
    setBodyClass
} from "./js/Utils";
import {
    GetGIForm,
    IngredientsList,
    ShowGlycemicInfo,
} from "./components/glycemic/Glycemic";
import AutoSuggest from "./components/autosuggest/AutoSuggest";
import { About } from "./pages/About";
import {Chart} from "./components/Chart/Chart";


const Maindish = ({maindish, extendedIngredients, getGlycemicLoad, gLoad, gIndex, setHasError, getAutocompleteUrl, autocompleteConfig}) => {
    return (
        <div className={'maindish'}>
            {maindish?.title && <>
                    <h1>{maindish.title}</h1>
                    <Router>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/about">About</Link>
                                </li>
                                <li>
                                    <Link to="/users">Users</Link>
                                </li>
                            </ul>
                        </nav>
                        <Routes>
                            <Route path="/about">
                                <About />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                        </Routes>
                    </Router>
                    <p>glutenFree: {maindish.glutenFree.toString()}</p>
                    <IngredientsList extendedIngredients={extendedIngredients} />
                    <GetGIForm
                        getGlycemicLoad={getGlycemicLoad}
                        gLoad={gLoad}
                        gIndex={gIndex} />
                </>}
            {!maindish?.title && <>
                <Router>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            <li>
                                <Link to="/users">Users</Link>
                            </li>
                            <li>
                                <Link to="/">Find GI</Link>
                            </li>
                        </ul>
                    </nav>
                    <Routes>
                        <Route path="/about" element={ <About /> } />
                        <Route path="/users" element={ <Users /> } />
                    </Routes>
                </Router>
                <AutoSuggest
                    setHasError={setHasError}
                    getAutocompleteUrl={getAutocompleteUrl}
                    autocompleteConfig={autocompleteConfig}
                    getGlycemicLoad={getGlycemicLoad} />
                <ShowGlycemicInfo
                    gIndex={gIndex}
                    gLoad={gLoad} />
                <h2>hello</h2>
                <Chart />
            </>}
        </div>);
}

function App() {
    const [isLoading, setLoading] = useState(true);
    let maindish;
    // const [maindish, setMaindish] = useState('');
    const [gLoad, setGlycemicLoad] = useState('');
    const [gIndex, setGlycemicIndex] = useState({});
    const [hasError, setHasError] = useState(false);
    const [extendedIngredients, setIngredients] = useState([]);

    const auth = `apiKey=${PRIMARY_API.apiKey}`
    // const random = `${PRIMARY_API.baseURL}/recipes/random?maxCarbs=20&number=2&type=vegan&${auth}`;
    const glycemicLoad = `${PRIMARY_API.baseURL}/food/ingredients/glycemicLoad?${auth}`;
    const autocomplete = `${PRIMARY_API.baseURL}/food/ingredients/autocomplete?${auth}&number=12`;
    const getAutocompleteUrl = query => `${autocomplete}&query=${query}`;

    const basicRequest = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const glycemicLoadConfig = Object.assign({
        method: 'post',
        url: glycemicLoad,
    }, basicRequest);
    // const randomConfig = Object.assign({
    //     method: 'GET',
    //     url: random,
    // }, basicRequest);
    const autocompleteConfig = Object.assign({
        method: 'GET',
    }, basicRequest);
    // const handleRandomResponse = (response) => {
    //     if (response.status !== 200) {
    //         setHasError(true);
    //         setLoading(false);
    //         return;
    //     }
    //     const data = response.data?.recipes[0] || '';
    //     const ingredients = [...data.extendedIngredients];
    //     ingredients.forEach( ingredient => ingredient.uid = hash(ingredient.original))
    //     setIngredients(ingredients);
    //     console.log('ingredients', ingredients)
    //     console.log(data)
    //     setMaindish(data);
    //     setLoading(false);
    // }
    const getGlycemicLoad = (ingredient = null) => {
        const processResponseData = response => {
            const data = response?.data || {};
            const temp = Array.from(extendedIngredients);
            // add GI info to existing ingredients array
            temp.forEach( item => {
                const updateItem = data.ingredients.find(function(v, i) {
                    return v.original === item.original;
                });
                item.glycemicIndex = updateItem?.glycemicIndex || 0;
                item.glycemicLoad = updateItem?.glycemicLoad || 0;
            });
            temp.sort(sortGI);
            console.log('extendedIngredients', temp);
            console.log('temp[0]', temp[0])
            // update GI Info section
            setGlycemicLoad(data.totalGlycemicLoad);
            if (temp.length === 0) {
                setGlycemicIndex(data.ingredients[0]);
            } else {
                setGlycemicIndex(temp[0]);
            }

            // update ingredients list
            setIngredients(temp);
        }
        if (!extendedIngredients || !ingredient) {
            setGlycemicLoad('data not found :(')
            return;
        }
        if (ingredient) {
            glycemicLoadConfig.data = JSON.stringify({ ingredients: [ingredient] });
        } else {
            glycemicLoadConfig.data = JSON.stringify({
                ingredients: extendedIngredients.map(
                    (currentValue) => currentValue.original
                )
            });
        }
        setGlycemicLoad('');
        setGlycemicIndex({});
        axios(glycemicLoadConfig)
            .then(processResponseData)
            .catch(error => console.error(error));
    }
    // const getRandomDish = () => {
    //     axios(randomConfig)
    //         .then(handleRandomResponse)
    //         .catch(() => {
    //             setHasError(true);
    //             setLoading(false);
    //         })
    // }

    useEffect(() => {
        // getRandomDish()
        // setHasError(true);
      setLoading(false);
    }, []);


  if (isLoading) {
      setBodyClass('--loading');
      return (<div className={'maindish'}>Loading...</div>)
  } else if (!isLoading && hasError) {
      setBodyClass('--loading', false);

        return (
            <div className={'--centre'}>
                <h1>Sorry</h1>
                <p>The API requests have reached the daily limit, please try again tomorrow.</p>
            </div>
        )
    } else {
      setBodyClass('--loading', false);

      return <Maindish
          maindish={maindish}
          extendedIngredients={extendedIngredients}
          getGlycemicLoad={getGlycemicLoad}
          gLoad={gLoad}
          gIndex={gIndex}
          setHasError={setHasError}
          getAutocompleteUrl={getAutocompleteUrl}
          autocompleteConfig={autocompleteConfig}  />
  }
}

const Users = () => {
    return (
        <section>
            <h1>Users</h1>
        </section>
    );
}

export default App;
