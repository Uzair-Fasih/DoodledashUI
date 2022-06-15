import MetaMaskOnboarding from "@metamask/onboarding";

const onboarding = new MetaMaskOnboarding();
const { ethereum } = window;

export const isMetaMaskInstalled = () => {
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const installMetaMask = (handleErr) => {
  try {
    onboarding.startOnboarding();
  } catch (err) {
    handleErr(err);
  }
};

export const connectMetaMaskWallet = async (handleErr, resolve) => {
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts && accounts[0] > 0) resolve(accounts[0]);
    else handleErr(new Error("Something went wrong!"));
  } catch (err) {
    handleErr(err);
  }
};
