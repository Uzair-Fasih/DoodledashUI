import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { marked } from "marked";

import { getFAQ } from "../../utilities/cms";
import "./faq.css";
import Loading from "../loading/Loading";

export default function FAQ() {
  const [isLoading, setLoading] = useState(true);
  const [dangerousHTML, setDangerousHTML] = useState("");

  useEffect(() => {
    getFAQ()
      .then((response) => {
        setDangerousHTML(
          _.get(response, "data.frequentlyAskedQuestion.faqMarkdown")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const html = useMemo(() => marked.parse(dangerousHTML), [dangerousHTML]);

  if (isLoading) return <Loading />;
  return (
    <div id="how-it-works" className="faq">
      {!_.isEmpty(dangerousHTML) && (
        <div
          className="content-container"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      )}
      {_.isEmpty(dangerousHTML) && (
        <div className="content-container">
          <h1 id="how-does-it-work-">How does it work?</h1>
          <h3 id="what-is-doodledash-">What is DoodleDash?</h3>
          <p>
            DoodleDash is a community-generated NFT. The idea behind DoodleDash
            is to allow people from all walks of life to participate in creating
            a community-generated NFT.
          </p>
          <h3 id="how-does-it-work-">How does it work?</h3>
          <p>
            A user can connect their wallet and use their mouse or touch to draw
            a line. Participate in creating a unique collaborative art with the
            rest of the user. For the early version, we are limited to lines,
            but in the future, we would be opening it up to color lines, shapes,
            and free hand.
          </p>
          <h3 id="how-can-i-draw-multiple-lines-">
            How can I draw multiple lines?
          </h3>
          <p>
            To give the value to the art, we are restricting one line per
            wallet. However, holder of DoodleDash can draw multiple lines in the
            future.
          </p>
          <h3 id="why-do-i-need-to-have-0-01-eth-to-draw-a-line-">
            Why do I need to have 0.01 eth to draw a line?
          </h3>
          <p>
            To combat bots. We don’t want fresh wallets drawing line. We let you
            draw a line if you qualify either of these.
          </p>
          <ul>
            <li>Have at least 0.01 eth in your wallet.</li>
            <li>have made some transaction using the wallet.</li>
          </ul>
          <h3 id="how-is-the-value-of-doodledash-determined-">
            How is the value of DoodleDash determined?
          </h3>
          <p>
            Instead of clinging to the usual aesthetics or traits that are
            decided by the creator of the art. The value of DD art is determined
            by meta-data like how many lines are on it, how long it took to make
            the art, what influencer participated in the art.
          </p>
          <h3 id="how-will-one-doodledash-be-different-from-other-">
            How will one Doodledash be different from other?
          </h3>
          <p>
            Each DoodleDash will have unique properties like “x lines”.
            “Generated in 5 mins.” “Has most number of lines with different
            countries.”
          </p>
          <p>
            Doodledash uniqueness will be determined by its meta-data. And, the
            one’s to create that meta-data will be people such as yourself.
          </p>
          <h3 id="when-is-the-nft-minted-">When is the NFT Minted?</h3>
          <p>The first mint happens on June 23rd 2022 6:30 pm.</p>
          <h3 id="what-will-be-the-mint-price-">
            What will be the mint price?
          </h3>
          <p>
            Each line represents 0.01 eth value. Depending on how many lines are
            drawn till the end of canvas timeout, that would be the mint price.
            If 100 lines are drawn then the mint price will be 0.01 x 100 = 1
            ETH.
          </p>
          <h3 id="how-will-sales-affect-doodler-">
            How will sales affect doodler?
          </h3>
          <p>
            Anyone who takes part in creating a doodledash will be donating to
            the impactGlobal. . When the NFT goes up for sale, then 70% of the
            sale value (after fees) will go to proceeds helping people suffering
            from Ukriane war. The donation will be transparent and can be viewed
            on blockchain.
          </p>
        </div>
      )}
    </div>
  );
}
