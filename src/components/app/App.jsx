import "./App.css";

import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../canvas/Canvas";
import ConnectWallet from "../connect-wallet/ConnectWallet";

import AuthContext from "../../context/Auth";

import canvasData from "../../test/canvasData.json";
import { useState, useContext, useEffect } from "react";

function App() {
  const [auth, setAuth] = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [showConnectWallet, setConnectWallet] = useState(false);
  const toggleConnectWallet = () => {
    setConnectWallet(!showConnectWallet);
  };

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts[0] > 0) {
      setAuth((state) => ({ ...state, walletId: accounts[0] }));
    }
    setLoading(false);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  if (isLoading) return null;
  return (
    <div className="App fade-in">
      {showConnectWallet && (
        <ConnectWallet toggleConnectWallet={toggleConnectWallet} />
      )}
      <header className="App-header">
        <NavigationBar toggleConnectWallet={toggleConnectWallet} />
      </header>
      <div className="App-body">
        <div className="App-hero">
          <p className="canvas-title">{canvasData.title}</p>
          <Canvas
            contributors={canvasData.contributors}
            toggleConnectWallet={toggleConnectWallet}
          />
        </div>
      </div>
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
