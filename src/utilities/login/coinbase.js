const onboarding = {
  startOnboarding: function () {
    window.open(
      "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad/related?hl=en&authuser=0",
      "_blank"
    );
  },
};
const { ethereum } = window;

export const isCoinbaseInstalled = () => {
  return Boolean(ethereum && ethereum.isCoinbaseWallet);
};

export const installCoinbase = (handleErr) => {
  try {
    onboarding.startOnboarding();
  } catch (err) {
    handleErr(err);
  }
};

export const connectCoinbaseWallet = async (handleErr, resolve) => {
  try {
    let provider = ethereum;
    // edge case if MM and CBW are both installed
    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(async (p) => {
        if (p.isCoinbase) provider = p;
      });
    }

    const accounts = await provider.request({
      method: "eth_requestAccounts",
      params: [],
    });

    if (accounts && accounts[0] > 0) resolve(accounts[0]);
    else handleErr(new Error("Something went wrong!"));
  } catch (err) {
    handleErr(err);
  }
};
