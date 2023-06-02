import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { chatRoomHandler, meetRoomHandler } from "../../../lib/server/utils";

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket?.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("====================================");
      console.log(
        "New socket id : ",
        socket.id,
        "Connected users: ",
        socket.client.conn.server.clientsCount
      );
      console.log("====================================");

      chatRoomHandler(socket, io);
      meetRoomHandler(socket, io);

      socket.on("disconnect", (reason) => {
        console.log(reason);

        console.log("====================================");
        console.log(
          "Disconnected id : ",
          socket.id,
          "Connected users: ",
          socket.client.conn.server.clientsCount
        );
        console.log("====================================");
        // io.in(roomId).emit('userDisconnected', socket.id); // notify other users in the room that this user has disconnected
      });
    });
  }

  res.end();
};

export default SocketHandler;
