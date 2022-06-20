import _ from "lodash";
import { useEffect, useState } from "react";
import { getSocial, getIntent } from "../../utilities/cms";
import "./social.css";

const defaultIntentParams = {
  url: "https://www.doodledash.art",
  text: "I’ve just added a line. Mark your line for free to be part of community-generated NFT.",
};

export default function Discord() {
  const [twitterShare, setTwitterShare] = useState(
    "https://twitter.com/intent/tweet?"
  );
  const [social, setSocial] = useState({
    discord: "https://discord.com",
  });

  const setTwitterIntent = (intentParams = defaultIntentParams) => {
    const u = new URLSearchParams(intentParams).toString();
    setTwitterShare("https://twitter.com/intent/tweet?" + u);
  };

  useEffect(() => {
    setTwitterIntent();

    getSocial().then((response) => {
      const res = _.chain(response)
        .get("data.socialMediaPage")
        .pick(["discord"])
        .value();
      setSocial((state) => ({ ...state, ...res }));
    });

    getIntent().then((response) => {
      const intentParams = _.chain(response)
        .get("data.intent")
        .omitBy((param) => _.isEmpty(param) || _.isNil(param))
        .value();
      setTwitterIntent(intentParams);
    });
  }, []);

  return (
    <p>
      Thank you for contributing. Join our{" "}
      <a
        href={social.discord}
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: "inherit", color: "inherit", fontFamily: "inherit" }}
      >
        Discord <img src="/icons/discord.svg" alt="Doodledash discord" />
      </a>{" "}
      to stay in touch. Share your artistic contribution with your friends.
      {twitterShare && (
        <button
          className="twitter-share"
          onClick={() => window.open(twitterShare, "_blank")}
        >
          Share on Twitter <img src="/icons/twitter.svg" alt="Twitter" />
        </button>
      )}
    </p>
  );
}
