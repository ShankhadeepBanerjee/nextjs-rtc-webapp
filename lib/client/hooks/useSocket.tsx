import React, { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Props = {};

const useSocket = (props: Props) => {
  const socketConnectedRef = useRef(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  useEffect(() => {
    const init = async () => {
      if (socketConnectedRef.current) return;
      socketConnectedRef.current = true;

      await fetch(`${process.env.NX_BASE_URL}/v1/socket`); // init socket server
      socketRef.current = io();
    };
    init();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  return { socket: socketRef.current };
};

export default useSocket;
