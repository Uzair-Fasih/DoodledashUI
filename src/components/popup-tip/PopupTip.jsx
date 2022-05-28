import "./popup-tip.css";

export default function PopupTip({
  clientX,
  clientY,
  walletAddress,
  createdAt,
}) {
  //
  return (
    walletAddress && (
      <div
        className="popup-tip"
        style={{
          left: `${clientX + 20}px`,
          top: `${clientY}px`,
        }}
      >
        <p>Added by:</p>
        <p>{walletAddress}</p>
        <p>{createdAt}</p>
      </div>
    )
  );
}
