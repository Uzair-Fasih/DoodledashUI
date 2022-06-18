const onboarding = {
  startOnboarding: function () {
    window.open("https://metamask.io/", "_blank");
  },
};

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
    let provider = ethereum;
    // edge case if MM and CBW are both installed
    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(async (p) => {
        if (p.isMetaMask) provider = p;
      });
    }

    const accounts = await provider.request({
      method: "eth_requestAccounts",
      params: [],
    });

    if (accounts && accounts[0] > 0) {
      localStorage.setItem("consent", true);
      resolve(accounts[0]);
    } else handleErr(new Error("Something went wrong!"));
  } catch (err) {
    handleErr(err);
  }
};
