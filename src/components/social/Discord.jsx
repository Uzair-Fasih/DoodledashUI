import _ from "lodash";
import { useEffect, useState } from "react";
import { getSocial } from "../../utilities/cms";

export default function Discord() {
  const [social, setSocial] = useState({
    discord: "https://discord.com",
  });

  useEffect(() => {
    getSocial().then((response) => {
      const res = _.chain(response)
        .get("data.socialMediaPage")
        .pick(["discord"])
        .value();
      setSocial((state) => ({ ...state, ...res }));
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
      to stay in touch
    </p>
  );
}
