import _ from "lodash";
import { useEffect, useState } from "react";
import { getSocial } from "../../utilities/cms";

import "./footer.css";

export default function Footer() {
  const [social, setSocial] = useState({
    twitter: "https://twitter.com",
    discord: "https://discord.com",
  });

  useEffect(() => {
    getSocial().then((response) => {
      const res = _.chain(response)
        .get("data.socialMediaPage")
        .pick(["discord", "twitter", "verifiedContract"])
        .value();
      setSocial((state) => ({ ...state, ...res }));
    });
  }, []);

  return (
    <div className="footer">
      <div className="content-container footer-content">
        <p className="left">
          Verified Contract:{" "}
          <a
            href={
              social.verifiedContract === "Coming Soon!"
                ? "#"
                : `https://etherscan.io/address/${social.verifiedContract}`
            }
          >
            {social.verifiedContract}
          </a>
        </p>
        <div className="right">
          <a href={social.twitter} target="_blank" rel="noreferrer">
            <img src="/icons/twitter.svg" alt="Doodledash twitter" />
          </a>
          <a href={social.discord} target="_blank" rel="noreferrer">
            <img src="/icons/discord.svg" alt="Doodledash instagram" />
          </a>
        </div>
      </div>
    </div>
  );
}
