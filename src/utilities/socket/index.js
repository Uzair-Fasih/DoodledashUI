import { io } from "socket.io-client";
import env from "../../env.json";

const connectionOptions = {
  transports: ["websocket"],
};

const socket = io.connect(env.server.socket, connectionOptions);
export default socket;
