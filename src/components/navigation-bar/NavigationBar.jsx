import "./navigation-bar.css";

export default function NavigationBar() {
  const routes = [
    {
      name: "Draw",
      url: "/draw",
    },
    {
      name: "Collection",
      url: "/collection",
    },
    {
      name: "How it works",
      url: "/how-it-works",
    },
  ];

  return (
    <div className="navigation-bar">
      <img
        className="logo"
        src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
        alt="Doodledash"
      />
      <div className="routes">
        {routes.map((route) => (
          <a href={route.url} key={route.url}>
            {route.name}
          </a>
        ))}
      </div>
      <button>Connect Wallet</button>
    </div>
  );
}
