import axios from "axios";
import "./App.css";

import FirstLandingTile from "./components/FirstLandingTile";
import SecondLandingTile from "./components/SecondLandingTile";
import ThirdLandingTile from "./components/ThirdLandingTile";
import Navigation from "./components/Navigation";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="App">
      <Navigation />
      <FirstLandingTile />
      <SecondLandingTile />
      <ThirdLandingTile />
    </div>
  );
}

export default App;
