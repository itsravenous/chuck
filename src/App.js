import React from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

const apiBaseUrl = "http://api.icndb.com";
function App() {
  const [joke, setJoke] = React.useState(
    "If Chuck Norris was using this application, he'd have clicked the joke button by now"
  );
  const fetchRandomJoke = async () => {
    const { data } = await axios.get(
      `${apiBaseUrl}/jokes/random?exclude=[explicit]`
    );
    setJoke(data.value.joke);
  };
  return (
    <div className="App">
      <button onClick={fetchRandomJoke}>Random joke</button>
      {joke}
    </div>
  );
}

export default App;
