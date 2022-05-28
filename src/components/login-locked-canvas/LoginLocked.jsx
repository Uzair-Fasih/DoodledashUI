import { useContext } from "react";
import AuthContext from "../../context/Auth";

import "./login-locked.css";

export default function LoginLocked({ toggleConnectWallet, children }) {
  const [auth] = useContext(AuthContext);
  return (
    <div className="login-locked">
      {children}
      {!auth.walletId && (
        <button className="login-locked-button" onClick={toggleConnectWallet}>
          Connect wallet to continue
        </button>
      )}
    </div>
  );
}
