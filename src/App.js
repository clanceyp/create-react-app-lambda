import React, { useEffect, useState, Fragment } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import axios from "axios";
import { IngridentContext } from "./contexts/IngridentContext";
import { PRIMARY_API } from "./js/Constants";
import {
    sortGI,
    setBodyClass
} from "./js/Utils";
import {
    GetGIForm,
    IngredientsList,
    ShowGlycaemicInfo,
} from "./components/glycaemic/Glycaemic";
import AutoSuggest from "./components/autosuggest/AutoSuggest";
import { Chart } from "./components/chart/Chart";

const Nav = () => {
    return (<Router>
        <nav>
            <ul>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
    </Router>)
}

const TopIngredientPanel = ({maindish, extendedIngredients, getGlycaemicLoad, gLoad, gIndex, setHasError, getAutocompleteUrl, autocompleteConfig}) => {
    return (
        <div className={'maindish'}>
            <h1>Welcome to Lowspike</h1>
            <p>powered by <a href={'https://spoonacular.com/'} target={'_blank'}>https://spoonacular.com/</a></p>
            <AutoSuggest
                setHasError={setHasError}
                getAutocompleteUrl={getAutocompleteUrl}
                autocompleteConfig={autocompleteConfig}
                getGlycaemicLoad={getGlycaemicLoad} />
            <ShowGlycaemicInfo
                gIndex={gIndex}
                gLoad={gLoad} />
            <Chart gIndex={gIndex} />
        </div>);
}
const Maindish = ({maindish, extendedIngredients, getGlycaemicLoad, gLoad, gIndex, setHasError, getAutocompleteUrl, autocompleteConfig}) => {
    return (
        <div className={'maindish'}>
            {maindish?.title && <>
                    <h1>{maindish.title}</h1>
                    <Nav />
                    <p>glutenFree: {maindish.glutenFree.toString()}</p>
                    <IngredientsList extendedIngredients={extendedIngredients} />
                    <GetGIForm
                        getGlycaemicLoad={getGlycaemicLoad}
                        gLoad={gLoad}
                        gIndex={gIndex} />
                </>}
            {!maindish?.title && <>
                <Nav />
                <AutoSuggest
                    setHasError={setHasError}
                    getAutocompleteUrl={getAutocompleteUrl}
                    autocompleteConfig={autocompleteConfig}
                    getGlycaemicLoad={getGlycaemicLoad} />
                <ShowGlycaemicInfo
                    gIndex={gIndex}
                    gLoad={gLoad} />
                <Chart gIndex={gIndex}/>
            </>}
        </div>);
}

function SetGiValue(i) {
    const max = 80;
    const min = 20;
    const clamp = (num) => (min + num + max) - Math.min(min, num, max) - Math.max(min, num, max)
    const [myNumber, setMyNumber] = useState(clamp(i));

    function handleMyNumber(num) {
        setMyNumber( clamp(num) );
    }

    return [myNumber, handleMyNumber];
}
// <button onClick={() => setFoo('up')}>up</button><span>{foo}</span><button onClick={() => setFoo('down')}>down</button>
function App() {
    const [isLoading, setLoading] = useState(true);
    const [gLoad, setGlycemicLoad] = useState('');
    const [gIndex, setGlycemicIndex] = useState({});
    const [hasError, setHasError] = useState(false);
    const [extendedIngredients, setIngredients] = useState([]);
    // const [giDuration, setGiDuration] = useState(0);
    const [giDuration, setGiDuration] = SetGiValue(0);
    let maindish;

    const auth = `apiKey=${PRIMARY_API.apiKey}`
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
    const autocompleteConfig = Object.assign({
        method: 'GET',
    }, basicRequest);
    const getGlycaemicLoad = (ingredient = null) => {
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
            console.log('extendedIngredients', response.data);
            console.log('temp[0]', temp[0]);
            console.log('temp.length', temp.length);
            console.log('data.totalGlycemicLoad', data.totalGlycemicLoad);
            // update GI Info section
            setGlycemicLoad(data.totalGlycemicLoad);
            if (temp.length) {
                setGlycemicIndex(temp[0]);
                setGiDuration(temp[0].glycemicIndex);
            } else if (data.ingredients.length) {
                setGlycemicIndex(data.ingredients[0]);
                setGiDuration(data.ingredients[0].glycemicIndex);
            } else {
                setGlycemicIndex({
                    glycemicIndex: 0,
                    glycemicLoad: 0
                });
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

    useEffect(() => {
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

      return <div>
          <button onClick={() => setGiDuration( giDuration + 5 )}>up</button><span>{giDuration}</span><button onClick={() => setGiDuration(giDuration - 5)}>down</button>
          <IngridentContext.Provider value={{ giDuration, setGiDuration }}>
              <TopIngredientPanel
              maindish={maindish}
              extendedIngredients={extendedIngredients}
              getGlycaemicLoad={getGlycaemicLoad}
              gLoad={gLoad}
              gIndex={gIndex}
              setHasError={setHasError}
              getAutocompleteUrl={getAutocompleteUrl}
              autocompleteConfig={autocompleteConfig}  />
          </IngridentContext.Provider>
      </div>
  }
}

export default App;
