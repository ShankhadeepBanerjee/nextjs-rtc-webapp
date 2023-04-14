import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { CreateRoomKey, JoinRoomKey, LeaveRoomKey, MessageReceiveKey, MessageSendKey, RoomCreatedKey } from '../../../lib/common/utils';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket?.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket?.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('====================================');
      console.log('New socket id : ', socket.id, 'Connected users: ', socket.client.conn.server.clientsCount);
      console.log('====================================');


      socket.on(CreateRoomKey, () => {
        console.log('Here creating in server');
        
        const roomId = Math.random().toString(36).substring(7); // generate a random room ID
        socket.join(roomId);
        console.log('====================================');
        console.log('Room created with ID:', roomId);
        console.log('====================================');
        io.to(roomId).emit(RoomCreatedKey, roomId); // notify the user that the room has been created
      });

      socket.on(JoinRoomKey, (data) => {
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
      socket.on(LeaveRoomKey, (roomId: string) => {
        socket.leave(roomId);
        console.log(`Client ${socket.id} left room ${roomId}`);
      });


      socket.on(MessageSendKey, ({roomId, message}) => {
        console.log('====================================');
        console.log('Recieved message from room: ', roomId,  message);
        console.log('====================================');
        io.to(roomId).emit(MessageReceiveKey, message); // broadcast the message to all users in the room
      });

      socket.on('disconnect', (reason) => {
        console.log(reason);
        
        console.log('====================================');
        console.log('Disconnected id : ', socket.id, 'Connected users: ', socket.client.conn.server.clientsCount);
        console.log('====================================');
        // io.in(roomId).emit('userDisconnected', socket.id); // notify other users in the room that this user has disconnected
      });

      
    });
  }

  res.end();
};

export default SocketHandler;
