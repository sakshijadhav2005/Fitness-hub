// /client/src/utils/socket.js

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"], // optional for better compatibility
});

export default socket;
