import React, { useState, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "./time-locked.css";
import _ from "lodash";

import { getSocial } from "../../../../utilities/cms";

dayjs.extend(relativeTime);

const pad = (n) => {
  return n < 10 ? "0" + n : n;
};

const getTimerContent = (availableAt) => {
  const today = new Date();
  const endDate = new Date(availableAt);

  const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24));
  const hours = parseInt((Math.abs(endDate - today) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt(
    (Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60
  );
  const seconds = parseInt(
    (Math.abs(endDate.getTime() - today.getTime()) / 1000) % 60
  );
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default function TimeLocked({
  availableAt,
  completedAt,
  isCompleted,
  nftLink,
  forceRender = _.noop,
  children,
}) {
  const [showContent, setShowContent] = useState(
    _.isNil(availableAt) ? true : new Date() > new Date(availableAt)
  );
  const [countdown, setCounter] = useState("--:--:--:--");
  const [social, setSocial] = useState({
    twitter: "https://twitter.com",
    discord: "https://discord.com",
  });

  useEffect(() => {
    if (!showContent) {
      const interval = setInterval(() => {
        const isAvailableNow = new Date() > new Date(availableAt);
        setCounter(getTimerContent(availableAt));
        if (isAvailableNow) {
          setShowContent(true);
          forceRender();
          clearInterval(interval);
        }
      }, 1000);
    } else if (!isCompleted) {
      const interval = setInterval(() => {
        const isCompletedNow = new Date() > new Date(completedAt);
        setCounter(getTimerContent(completedAt));
        if (isCompletedNow) {
          clearInterval(interval);
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSocial().then((response) => {
      const res = _.chain(response)
        .get("data.socialMediaPage")
        .pick(["discord", "twitter"])
        .value();
      setSocial((state) => ({ ...state, ...res }));
    });
  }, []);

  if (showContent)
    return (
      <React.Fragment>
        {children}
        <div className="completed-at-info">
          {!isCompleted && (
            <React.Fragment>
              <p>
                This canvas will be available until{" "}
                <b>{dayjs(completedAt).format("dddd, MMMM D, YYYY h:mm A")}</b>
              </p>
              <h2>{countdown}</h2>
            </React.Fragment>
          )}

          {isCompleted && (
            <b>
              DDLDH#1 is complete.{" "}
              {nftLink
                ? `Please visit ${nftLink} to buy`
                : "Check back later to see the minted doodle"}
              .
            </b>
          )}
        </div>
      </React.Fragment>
    );
  return (
    <div className="time-locked-parent">
      <div className="time-locked">
        <p>
          This canvas will be available for drawing on
          <br />
          <b>{dayjs(availableAt).format("dddd, MMMM D, YYYY h:mm A")}</b>
        </p>
        <h2>{countdown}</h2>
        <p>Follow us on social for heads up when the doodle goes live</p>
        <div className="time-locked-call-to-actions">
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
