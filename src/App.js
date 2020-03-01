import React from 'react';
import axios from 'axios';
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
  const fetchRandomJoke = async () => {
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/jokes/random?exclude=[explicit]`
      );
      setJoke(data.value.joke);
    } catch {
      setError(errorMessage);
      setJoke('');
    }
  };
  return (
    <div className="App">
      <button onClick={fetchRandomJoke}>Random joke</button>
      {joke}
      {error}
    </div>
  );
}

export default App;
