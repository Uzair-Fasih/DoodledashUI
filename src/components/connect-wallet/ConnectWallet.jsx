import MetaMaskOnboarding from "@metamask/onboarding";
import { useState, useContext } from "react";
import AuthContext from "../../context/Auth";
import "./connect-wallet.css";

const onboarding = new MetaMaskOnboarding();

export default function ConnectWallet({ toggleConnectWallet }) {
  const [auth, setAuth] = useContext(AuthContext);
  const { ethereum } = window;
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMetaMaskInstalled = () => {
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const installMetaMask = () => {
    onboarding.startOnboarding();
    toggleConnectWallet();
  };

  const connectMetaMaskWallet = async (event) => {
    setLoading(true);
    setError(null);
    event.stopPropagation();
    event.preventDefault();
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts[0] > 0) {
        setAuth((state) => ({ ...state, walletId: accounts[0] }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (auth.walletId) return null;
  return (
    <div
      className="fade-in connect-wallet-backdrop"
      onClick={toggleConnectWallet}
    >
      <div className="scale-in connect-wallet">
        <p>Connect your MetaMask wallet to continue</p>
        {error && <p className="error">{error}</p>}
        {isLoading ? (
          <span className="login-loader">
            <img src="/icons/loader.svg" alt="|" />
          </span>
        ) : isMetaMaskInstalled() ? (
          <button onClick={connectMetaMaskWallet}>Connect MetaMask</button>
        ) : (
          <button onClick={installMetaMask}>Install MetaMask</button>
        )}
      </div>
    </div>
  );
}
