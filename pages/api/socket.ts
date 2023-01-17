import { Socket, Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next'; 


import messageHandler from "../../lib/server/utils/sockets/messagehandler";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default function SocketHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    messageHandler(socket);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}