import "./App.css";

import _ from "lodash";
import { useState, useEffect, useContext } from "react";
import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../canvas/Canvas";
import Alert from "../alert/Alert";
import Table from "../table/Table";
import FAQ from "../faq/FAQ";

import { loadWallet } from "../../utilities/login/connect";
import baseApi from "../../utilities/axios";
import socket from "../../utilities/socket";

import AuthContext from "../../context/Auth";
import Collection from "../collection/Collection";
import Footer from "../footer/Footer";
import Announcement from "../announcement/Announcement";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth] = useContext(AuthContext);
  const [canvasData, setCanvasData] = useState({ data: {}, isLoaded: false });
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    loadWallet(setLoading, setAuth);
  }, [setAuth]);

  useEffect(() => {
    if (canvasData.isLoaded) return;

    baseApi
      .get("/art/active")
      .then((response) => {
        // Initial data
        setCanvasData({
          data: _.get(response, "data", {}),
          isLoaded: true,
        });

        // Subsequent updates
        socket.on("message", ({ event, data }) => {
          if (!data) return;
          setCanvasData({
            data,
            isLoaded: true,
          });
        });
      })
      .catch((err) => {
        console.error(err);
        setCanvasData((state) => ({ ...state, isLoaded: true }));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return null;
  return (
    <div className="App fade-in">
      <header className="App-header">
        <Announcement />
        <NavigationBar />
      </header>
      <main className="App-body">
        <Alert />
        <div id="draw" className="App-hero">
          <Canvas canvasData={canvasData} />
        </div>
        <Table canvasData={canvasData} />
        <Collection />
        <FAQ />
        <Footer />

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
