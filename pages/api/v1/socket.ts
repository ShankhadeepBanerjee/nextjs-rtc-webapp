import { NextApiResponse } from "next";
import { Server } from "socket.io";
import { chatRoomHandler, meetRoomHandler } from "../../../lib/server/utils";

import type { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

class SocketWithIO extends NetSocket {
  private _server: SocketServer;

  constructor(server: SocketServer) {
    super();
    this._server = server;
  }

  public get server(): SocketServer {
    return this._server;
  }
}

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const SocketHandler = (res: NextApiResponseWithSocket) => {
  if (res.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket?.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      chatRoomHandler(socket, io);
      meetRoomHandler(socket, io);

      socket.on("disconnect", (reason) => {
        console.log(reason);
        // io.in(roomId).emit('userDisconnected', socket.id); // notify other users in the room that this user has disconnected
      });
    });
  }

  res.end();
};

export default SocketHandler;
