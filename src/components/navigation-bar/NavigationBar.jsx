import React, { useContext } from "react";
import AuthContext from "../../context/Auth";
import Avatar from "./generateAvatar";
import "./navigation-bar.css";

import { connectWallet } from "../../utilities/login/connect";

const UserDetail = ({ walletId }) => {
  return (
    <div className="user-detail">
      <div className="avatar">
        <Avatar walletId={walletId} />
      </div>
      <div className="user-meta">
        <h1>Unnamed</h1>
        <p>
          {walletId.slice(0, 6) + "..." + walletId.slice(walletId.length - 4)}
        </p>
      </div>
    </div>
  );
};

export default function NavigationBar() {
  const [auth] = useContext(AuthContext);
  const routes = [
    {
      name: "Draw",
      url: "#draw",
    },
    // {
    //   name: "Collection",
    //   url: "/collection",
    // },
    {
      name: "How it works",
      url: "#how-it-works",
    },
  ];

  return (
    <div className="content-container navigation-bar">
      <img className="logo" src="/images/logo.png" alt="Doodledash" />

      <div className="routes">
        {routes.map((route) => (
          <a href={route.url} key={route.url}>
            {route.name}
          </a>
        ))}
      </div>

      <React.Fragment>
        {!auth.walletId && (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}

        {auth.walletId && <UserDetail walletId={auth.walletId} />}
      </React.Fragment>
    </div>
  );
}
