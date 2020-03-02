import React from 'react';
import axios from 'axios';
import { Router, navigate } from '@reach/router';
import { SearchForm } from './SearchForm';
import chuck from './chuck.jpg';
import './App.css';

const initialMessage =
  "If Chuck Norris was using this application, he'd have clicked the joke button by now";
const errorMessage =
  'Chuck Norris has declined your ridiculous request for a joke 🤠';
const apiBaseUrl = 'http://api.icndb.com';

function App() {
  const [joke, setJoke] = React.useState(initialMessage);
  const [error, setError] = React.useState();

  const fetchRandomJoke = async ({ firstName, lastName }) => {
    let url = `${apiBaseUrl}/jokes/random?exclude=[explicit]&escape=javascript`;
    if (firstName) url += `&firstName=${firstName}`;
    if (lastName) url += `&lastName=${lastName}`;
    try {
      const { data } = await axios.get(url);
      setJoke(data.value.joke);
    } catch {
      setError(errorMessage);
      setJoke('');
    }
  };

  const gotoSearch = () => {
    navigate('/search');
  };

  return (
    <div className="chuck">
      <img className="chuck__image" alt="Chuck says:" src={chuck} />

      <div className="chuck__buttons">
        <button onClick={fetchRandomJoke}>Random joke</button>
        <button onClick={gotoSearch}>Search jokes</button>
      </div>
      <div className="chuck__message">
        {joke}
        {error}
      </div>
      <Router>
        <SearchForm
          path="/search"
          onSubmit={({ firstName, lastName }) => {
            fetchRandomJoke({ firstName, lastName });
          }}
        />
      </Router>
    </div>
  );
}

export default App;
