import React, {
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import {
  API_BASE_URL,
  MEET_CreateRoomKey,
  MEET_JoinRoomKey,
} from "../../common/utils";
import { RoomCreateProps } from "../../common/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface SocketContextType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  isLoading: boolean;
  error: any;
  isConnected: boolean;
  createRoom: (props?: RoomCreateProps) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  socketConnect: () => void;
  socketDisconnect: () => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isLoading: true,
  error: null,
  isConnected: false,
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  socketConnect: () => {},
  socketDisconnect: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRequestInProgressRef = useRef(false);

  const socketConnect = () => {
    if (connectionRequestInProgressRef.current || isConnected || isLoading) {
      return;
    }

    connectionRequestInProgressRef.current = true;
    setIsLoading(true);

    const newSocket = io(`${API_BASE_URL}`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
      setIsLoading(false);
      connectionRequestInProgressRef.current = false;
    });

    newSocket.on("connect_error", (err) => {
      console.log("Socket connection error: ", err);
      setError(err);
      setIsConnected(false);
      setIsLoading(false);
      connectionRequestInProgressRef.current = false;
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsLoading(false);
      setIsConnected(false);
    });
  };

  const socketDisconnect = () => {
    socket?.disconnect();
    setSocket(null);
  };

  const createRoom = (props?: RoomCreateProps) => {
    socket?.emit(MEET_CreateRoomKey, props);
  };

  const joinRoom = (roomId: string) => {
    socket?.emit(MEET_JoinRoomKey, { roomId });
  };

  const leaveRoom = (roomId: string) => {
    socket?.emit("leaveRoom", roomId);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isLoading,
        error,
        isConnected,
        createRoom,
        joinRoom,
        leaveRoom,
        socketConnect,
        socketDisconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const {
    socket,
    isLoading,
    error,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    socketConnect,
    socketDisconnect,
  } = useContext(SocketContext);

  return {
    socket,
    isLoading,
    error,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    socketConnect,
    socketDisconnect,
  };
};
