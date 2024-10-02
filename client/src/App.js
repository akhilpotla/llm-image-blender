import './App.css';

import FirstLandingTile from './components/FirstLandingTile';
import SecondLandingTile from './components/SecondLandingTile';
import ThirdLandingTile from './components/ThirdLandingTile';
import Navigation from './components/Navigation';

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
