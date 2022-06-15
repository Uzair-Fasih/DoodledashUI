import "./App.css";

import { useState, useEffect, useContext } from "react";
import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../canvas/Canvas";
import Alert from "../alert/Alert";

import { loadWallet } from "../../utilities/login/connect";

import AuthContext from "../../context/Auth";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth] = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet(setLoading, setAuth);
  }, [setAuth]);

  if (isLoading) return null;
  return (
    <div className="App fade-in">
      <header className="App-header">
        <NavigationBar />
      </header>
      <main className="App-body">
        <Alert />
        <div className="App-hero">
          <Canvas />
        </div>

        <div className="guide-lines">
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
        </div>
      </main>
    </div>
  );
}

function AppWithProvider(props) {
  const authState = useState({
    walletId: null,
  });

  return (
    <AuthContext.Provider value={authState}>
      <App {...props} />
    </AuthContext.Provider>
  );
}

export default AppWithProvider;
