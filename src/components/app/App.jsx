import "./App.css";

import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../functional/canvas/Canvas";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar />
      </header>
      <div className="App-body">
        <p className="canvas-title">The beginning</p>
        <Canvas />
      </div>
    </div>
  );
}

export default App;
