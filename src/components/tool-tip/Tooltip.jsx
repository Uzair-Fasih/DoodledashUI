import "./tool-tip.css";
import _ from "lodash";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default function Tooltip() {
  const [showTooltip, setTooltipVisibility] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    content: {
      x: 500,
      y: 500,
      lines: [
        {
          walletId: "adsfdafdas",
          createdAt: "1990-01-01",
        },
        {
          walletId: "adsfdafdas",
          createdAt: "1990-01-01",
        },
        {
          walletId: "adsfdafdas",
          createdAt: "1990-01-01",
        },
      ],
    },
    resolve: _.noop,
  });

  useEffect(() => {
    const handle = (event) => {
      setTooltipVisibility(!event.detail.isClosed);
      if (event.detail.isClosed) return;

      const newState = {
        content: {
          x: event.detail.event.x,
          y: event.detail.event.y,
          lines: event.detail.lines.map((line) => line.__meta),
        },
        resolve: event.detail.resolve,
      };

      setTooltipData(newState);
    };

    const onClose = () => {
      setTooltipVisibility(false);
      tooltipData.resolve();
    };

    document.addEventListener("tooltip", handle);
    window.addEventListener("scroll", onClose);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("tooltip", handle);
      window.removeEventListener("scroll", onClose);
      window.removeEventListener("resize", onClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showTooltip) return;

  return (
    <div
      className="tool-tip scale-in"
      style={{
        top: _.get(tooltipData, "content.y", 0) + 20,
        left: _.get(tooltipData, "content.x", 0) + 20,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {_.get(tooltipData, "content.lines", []).map(
        ({ walletId, createdAt }, idx) => (
          <div key={idx} className="tooltip-section">
            <div className="wallet">
              {walletId.slice(0, 6)}...
              {walletId.slice(walletId.length - 4)}
            </div>
            <div className="date">
              placed a line {dayjs().to(dayjs(createdAt))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
