import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import "./popup-tip.css";
import AuthContext from "../../context/Auth";
import { useContext } from "react";

dayjs.extend(relativeTime);

export default function PopupTip({ clientX, clientY, walletId, createdAt }) {
  const [auth] = useContext(AuthContext);
  const isMe = auth.walletId === walletId;
  return (
    walletId && (
      <div
        className={`popup-tip ${isMe ? "secondary" : ""}`}
        style={{
          left: `${clientX + 20}px`,
          top: `${clientY}px`,
        }}
      >
        <p>
          Added by
          <b>{` ${isMe ? "You" : walletId}, `}</b>
        </p>
        <p>{dayjs(createdAt).fromNow()}</p>
      </div>
    )
  );
}
