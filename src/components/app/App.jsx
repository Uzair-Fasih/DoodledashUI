import "./App.css";

import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../canvas/Canvas";
import canvasData from "../../test/canvasData.json";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar />
      </header>
      <div className="App-body">
        <div className="App-hero">
          <p className="canvas-title">{canvasData.title}</p>
          <Canvas
            contributors={canvasData.contributors}
            lockType="time-locked"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
