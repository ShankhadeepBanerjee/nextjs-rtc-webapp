import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { MessageReceiveKey, MessageSendKey } from '../../../lib/common/utils';


const SocketHandler = (req: NextApiRequest,
  res: NextApiResponse) => {
  if (res.socket?.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket?.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('====================================');
      console.log('New socket id : ', socket.id, 'Connected users: ', socket.client.conn.server.clientsCount);
      console.log('====================================');

      socket.on(MessageSendKey, msg => {
        console.log('====================================');
        console.log(msg);
        console.log('====================================');
        socket.broadcast.emit(MessageReceiveKey, msg)
      });

      socket.on('disconnect', r => {
        console.log('====================================');
        console.log('Disconnected id : ', r, 'Connected users: ', socket.client.conn.server.clientsCount);
        console.log('====================================');
      })

    })

    
  
  }
  res.end()
}

export default SocketHandler