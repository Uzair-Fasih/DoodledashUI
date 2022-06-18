import { io } from "socket.io-client";

const connectionOptions = {
  transports: ["websocket"],
};

const socket = io.connect(
  "https://blacklineapi.bothook.com/",
  connectionOptions
);
export default socket;
