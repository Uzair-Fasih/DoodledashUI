import "./App.css";

import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../functional/canvas/Canvas";
import canvasData from "../../test/canvasData.json";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar />
      </header>
      <div className="App-body">
        <p className="canvas-title">{canvasData.title}</p>
        <Canvas contributors={canvasData.contributors} />
      </div>
    </div>
  );
}

export default App;
