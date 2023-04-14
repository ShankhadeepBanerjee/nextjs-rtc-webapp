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
  createRoom: (username: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isLoading: true,
  error: null,
  createRoom: (username: string) => {},
  joinRoom: (roomId: string) => {},
  leaveRoom: (roomId: string) => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const socketConnectedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (socketConnectedRef.current) return;
      socketConnectedRef.current = true;

      console.log("Fetching server again");

      await fetch(`${process.env.NX_BASE_URL}/socket`); // init socket server
      const newSocket = io();

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        setIsLoading(false);
      });

      newSocket.on("connect_error", (err) => {
        console.log("Socket connection error: ", err);
        setIsLoading(false);
        setError(err);
      });
    };

    init();

    return () => {
      socket?.disconnect();
    };
  }, []);

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
        createRoom,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const { socket, isLoading, error, createRoom, joinRoom, leaveRoom } =
    useContext(SocketContext);
  return {
    socket,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
  };
};
