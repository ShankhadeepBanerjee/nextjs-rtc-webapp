import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  MEET_CreateRoomKey,
  MEET_RoomCreatedKey,
  MEET_JoinRoomKey,
  MEET_LeaveRoomKey,
  MEET_MessageSendKey,
  MEET_MessageReceiveKey,
  MEET_SendPeerOfferKey,
  MEET_ReceivePeerOfferKey,
  MEET_SendPeerAnswerKey,
  MEET_ReceivePeerAnswerKey,
} from "../../common/utils";
import { PeerAnserProps, PeerOfferProps } from "../../common/types";

export const meetRoomHandler = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  try {
    socket.on(MEET_CreateRoomKey, () => {
      console.log("Here creating in server");
      const roomId = Math.random().toString(36).substring(7); // generate a random room ID
      socket.join(roomId);
      console.log("====================================");
      console.log("Room created with ID:", roomId);
      console.log("====================================");
      io.in(roomId).emit(MEET_RoomCreatedKey, roomId); // notify the user that the room has been created
    });

    socket.on(MEET_JoinRoomKey, (data) => {
      const { roomId: joinRoomId } = data;
      if (joinRoomId) {
        const roomId = joinRoomId;
        socket.join(roomId);
        console.log("====================================");
        console.log("User joined room with ID:", roomId);
        console.log("====================================");
      }
    });

    socket.on(MEET_SendPeerOfferKey, ({ roomId, offer }: PeerOfferProps) => {
      if (offer) {
        socket.to(roomId).emit(MEET_ReceivePeerOfferKey, { offer }); // send the offer to the other user in the room
        console.log("====================================");
        console.log("Sent peer offer to room:", roomId);
        console.log("====================================");
      }
    });

    socket.on(MEET_SendPeerAnswerKey, ({ roomId, answer }: PeerAnserProps) => {
      if (answer) {
        socket.to(roomId).emit(MEET_ReceivePeerAnswerKey, { answer }); // send the offer to the other user in the room
        console.log("====================================");
        console.log("Sent peer answer to room:", roomId);
        console.log("====================================");
      }
    });

    // When a client emits the "leaveRoom" event, remove them from the specified room
    socket.on(MEET_LeaveRoomKey, (roomId: string) => {
      socket.leave(roomId);
      console.log(`Client ${socket.id} left room ${roomId}`);
    });

    socket.on(MEET_MessageSendKey, ({ roomId, message }) => {
      console.log("====================================");
      console.log("Received message from room:", roomId, message);
      console.log("====================================");
      io.to(roomId).emit(MEET_MessageReceiveKey, message); // broadcast the message to all users in the room
    });
  } catch (error) {
    console.log("Error handling socket event:", error);
  }
};
