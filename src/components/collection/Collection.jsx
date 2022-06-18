import _ from "lodash";
import React, { useEffect, useState } from "react";
import baseApi from "../../utilities/axios";
import Loading from "../loading/Loading";

import "./collection.css";

export default function Collection() {
  const [isLoading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    baseApi
      .post("/art/list")
      .then((response) => {
        const { data, status } = response;
        if (status) setCollections(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div id="collection" className="collection">
      <div className="content-container collection-content">
        <h1>Collection</h1>
        {!_.isEmpty(collections) && (
          <div className="collection-container">
            {collections.map(({ imgUrl, visitUrl }, idx) => (
              <CollectionFrame
                key={idx}
                imgUrl={imgUrl}
                visitUrl={visitUrl}
                idx={idx + 1}
              />
            ))}
          </div>
        )}
        {_.isEmpty(collections) && (
          <div className="no-doodles">
            No doodles available. We will go live soon 😄
          </div>
        )}
      </div>
    </div>
  );
}

const CollectionFrame = ({ imgUrl, idx, visitUrl }) => {
  return (
    <a
      className="collection-link"
      href={visitUrl}
      target="_blank"
      rel="noreferrer"
    >
      <div className="collection-frame">
        <img src={imgUrl} alt="DDLDSH#1" />
        <div className="collection-frame-data">
          <h2>DDLDSH#{idx}</h2>
        </div>
      </div>
    </a>
  );
};
