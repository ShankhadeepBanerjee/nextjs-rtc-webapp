import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CHAT_CreateRoomKey, CHAT_JoinRoomKey } from "../../common/utils";

interface SocketContextType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  isLoading: boolean;
  error: any;
  isConnected: boolean;
  createRoom: (username: string) => void;
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
  createRoom: (username: string) => {},
  joinRoom: (roomId: string) => {},
  leaveRoom: (roomId: string) => {},
  socketConnect: () => {},
  socketDisconnect: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const socketConnectedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketConnect = () => {
    if (socketConnectedRef.current) {
      console.log("====================================");
      console.log("Socket already connected");
      console.log("====================================");
      setIsConnected(true);
      return;
    }
    socketConnectedRef.current = true;

    console.log("Fetching server again");

    fetch(`${process.env.NX_BASE_URL}/socket`) // init socket server
      .then(() => {
        const newSocket = io();
        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log("Connected to socket server");
          setIsLoading(false);
          setIsConnected(true);
        });

        newSocket.on("connect_error", (err) => {
          console.log("Socket connection error: ", err);
          setIsLoading(false);
          setError(err);
          setIsConnected(false);
        });
      })
      .catch((err) => {
        console.log("Error fetching socket server: ", err);
        setIsLoading(false);
        setError(err);
      });
  };

  const socketDisconnect = () => {
    socket?.disconnect();
    setSocket(null);
    socketConnectedRef.current = false;
    setIsConnected(false);
  };

  const createRoom = (username: string) => {
    socket?.emit(CHAT_CreateRoomKey, username);
  };

  const joinRoom = (roomId: string) => {
    socket?.emit(CHAT_JoinRoomKey, { roomId });
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
