import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Button, Loader } from "../../lib/client/components";
import { useSocket } from "../../lib/client/contexts/SocketProvider";
import { CHAT_RoomCreatedKey } from "../../lib/common/utils";

type Props = {};

export default function Chat({}: Props) {
  const roomIdRef = useRef<HTMLInputElement>(null);
  const {
    socket,
    isLoading,
    socketConnect,
    createRoom,
    socketDisconnect,
    isConnected,
  } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) socketConnect();
    return () => {
      if (isConnected) socketDisconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(CHAT_RoomCreatedKey, (roomId: string) => {
      console.log("====================================");
      console.log("room created with id: ", roomId);
      console.log("====================================");
      router.push(`/chat/${roomId}`);
    });
  }, [socket]);

  const handleCreateRoom = () => {
    console.log("====================================");
    console.log(socket);
    console.log("====================================");
    if (socket) {
      createRoom("random user");
    }
  };

  const handleJoinRoom = () => {
    const roomId = roomIdRef.current?.value;
    if (roomId && socket) {
      console.log("joining room with id: ", roomId);
      return router.push(`/chat/${roomId}`);
    }
  };

  if (isLoading) {
    return <Loader loadingText={"Connecting to socket..."} />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-dark">
      <div>
        <Button
          className="rounded-lg px-5 font-semibold"
          onClick={handleCreateRoom}
        >
          Create A New Room
        </Button>
      </div>
      <p className="my-5 text-lg font-semibold text-light">
        <i>or,</i>
      </p>
      <span className="flex items-center gap-x-5">
        <input
          type="text"
          className="rounded-md p-2 text-dark"
          placeholder="Enter a code or Link"
          ref={roomIdRef}
        />
        <Button
          className="rounded-lg px-5 font-semibold"
          onClick={handleJoinRoom}
        >
          join
        </Button>
      </span>
    </div>
  );
}
