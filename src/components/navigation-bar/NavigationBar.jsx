import React, { useContext } from "react";
import AuthContext from "../../context/Auth";
import "./navigation-bar.css";

export default function NavigationBar({ toggleConnectWallet }) {
  const [auth] = useContext(AuthContext);
  const routes = [
    {
      name: "Draw",
      url: "/draw",
    },
    {
      name: "Collection",
      url: "/collection",
    },
    {
      name: "How it works",
      url: "/how-it-works",
    },
  ];

  return (
    <div className="navigation-bar">
      <img
        className="logo"
        src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
        alt="Doodledash"
      />
      <div className="routes">
        {routes.map((route) => (
          <a href={route.url} key={route.url}>
            {route.name}
          </a>
        ))}
      </div>
      <React.Fragment>
        {!auth.walletId && (
          <button onClick={toggleConnectWallet}>
            Connect Wallet{" "}
            <img src="/icons/metamask.svg" alt="using Metamask" />
          </button>
        )}
        {auth.walletId && (
          <span className="navigation-bar-logged-in heartbeat">
            {auth.walletId}
          </span>
        )}
      </React.Fragment>
    </div>
  );
}
