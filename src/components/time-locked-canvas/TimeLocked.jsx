import React, { useState, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "./time-locked.css";
import _ from "lodash";

dayjs.extend(relativeTime);

export default function TimeLocked({
  availableAt,
  forceRender = _.noop,
  children,
}) {
  const [showContent, setShowContent] = useState(
    new Date() > new Date(availableAt)
  );
  const [countdown, setCounter] = useState(new Date().toTimeString());

  useEffect(() => {
    if (!showContent) {
      const interval = setInterval(() => {
        const isAvailableNow = new Date() > new Date(availableAt);
        setCounter(new Date().toTimeString());
        if (isAvailableNow) {
          setShowContent(true);
          forceRender();
          clearInterval(interval);
        }
      }, 1000);
    }
  });

  if (showContent) return <React.Fragment>{children}</React.Fragment>;
  return (
    <div className="time-locked">
      <p>This canvas will be available for drawing on {countdown}</p>
    </div>
  );
}
