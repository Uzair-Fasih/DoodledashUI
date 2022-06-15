export default function alertEvent(detail) {
  return new Promise((resolve, reject) => {
    const event = new CustomEvent("alert", { detail: { resolve, ...detail } });
    document.dispatchEvent(event);
  });
}
