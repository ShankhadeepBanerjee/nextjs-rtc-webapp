import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function handler(socket : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>)  {
    const createdMessage = (msg: any) => {
        console.log('====================================');
        console.log('new message');
        console.log(msg );
        console.log('====================================');
        socket.broadcast.emit("newIncomingMessage", msg);
    };
  
    socket.on("createdMessage", createdMessage);

    
  };