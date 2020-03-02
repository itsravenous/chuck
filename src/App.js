import React from 'react';
import axios from 'axios';
import { Router, navigate } from '@reach/router';
import logo from './logo.svg';
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
    <div className="App">
      <button onClick={fetchRandomJoke}>Random joke</button>
      <button onClick={gotoSearch}>Search jokes</button>
      {joke}
      {error}
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

const SearchForm = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);

  const handleNameChange = name => {
    setName(name);
    setIsValid(name.length > 0 && name.split(' ').length < 3);
  };
  const handleSubmit = name => {
    const [firstName, lastName] = name.split(' ');
    onSubmit({ firstName, lastName });
  };

  return (
    <>
      <label htmlFor="name">Enter an inferior name</label>
      <input
        id="name"
        type="text"
        onChange={e => handleNameChange(e.target.value)}
        value={name}
      />
      <button
        disabled={!isValid}
        onClick={() => handleSubmit(name)}
        type="submit"
      >
        Submit
      </button>
    </>
  );
};

export default App;
