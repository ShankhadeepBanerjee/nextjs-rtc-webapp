import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CHAT_CreateRoomKey, CHAT_RoomCreatedKey, CHAT_JoinRoomKey, CHAT_LeaveRoomKey, CHAT_MessageSendKey, CHAT_MessageReceiveKey } from "../../common/utils";

export const chatRoomHandler = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  try {
    socket.on(CHAT_CreateRoomKey, () => {
      console.log('Here creating in server');
      
      const roomId = Math.random().toString(36).substring(7); // generate a random room ID
      socket.join(roomId);
      console.log('====================================');
      console.log('Room created with ID:', roomId);
      console.log('====================================');
      io.in(roomId).emit(CHAT_RoomCreatedKey, roomId); // notify the user that the room has been created
    });

    socket.on(CHAT_JoinRoomKey, (data) => {
      const { roomId: joinRoomId } = data;
      if (joinRoomId) {
        const roomId = joinRoomId;
        socket.join(roomId);
        console.log('====================================');
        console.log('User joined room with ID:', roomId);
        console.log('====================================');
      }
    });

    // When a client emits the "leaveRoom" event, remove them from the specified room
    socket.on(CHAT_LeaveRoomKey, (roomId: string) => {
      socket.leave(roomId);
      console.log(`Client ${socket.id} left room ${roomId}`);
    });

    socket.on(CHAT_MessageSendKey, ({roomId, message}) => {
      console.log('====================================');
      console.log('Received message from room:', roomId, message);
      console.log('====================================');
      io.to(roomId).emit(CHAT_MessageReceiveKey, message); // broadcast the message to all users in the room
    });
  } catch (error) {
    console.log("Error handling socket event:", error);
  }
};
