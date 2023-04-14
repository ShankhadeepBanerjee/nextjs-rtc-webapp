import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "../../lib/client/components";
import { useSocket } from "../../lib/client/contexts/SocketProvider";
import { RoomCreatedKey } from "../../lib/common/utils";

type Props = {};

export default function Chat({}: Props) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const { socket, isLoading, createRoom } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    socket.on(RoomCreatedKey, (roomId: string) => {
      console.log("====================================");
      console.log("room created with id: ", roomId);
      console.log("====================================");
      router.push(`/chat/${roomId}`);
    });
  }, [socket]);

  const initCreateRoom = () => {
    const username = usernameRef.current?.value;
    if (username && socket) {
      console.log("creating room with username: ", username);
      createRoom(username);
    }
  };

  const joinRoom = () => {
    const roomId = roomIdRef.current?.value;
    const username = usernameRef.current?.value;
    if (roomId && username && socket) {
      console.log("joining room with id: ", roomId);
      router.push(`/chat/${roomId}`);
    }
  };

  if (isLoading) {
    return <Loader loadingText={"Connecting to socket..."} />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-light">
      <h1 className="mb-5 text-2xl text-dark">This is a socket app</h1>
      <form className="flex flex-col items-center">
        <input
          type="text"
          ref={usernameRef}
          className="mb-3 w-full rounded-l-md bg-light px-2 py-1 text-dark"
          placeholder="Enter username..."
        />
        <input
          type="text"
          ref={roomIdRef}
          className="mb-3 w-full rounded-l-md bg-light px-2 py-1 text-dark"
          placeholder="Enter room ID..."
        />
        <div className="flex">
          <button
            type="button"
            className="rounded-l-md bg-primary px-3 py-1 text-dark transition-all duration-200 ease-in-out hover:bg-dark hover:text-light"
            onClick={initCreateRoom}
          >
            Create Room
          </button>
          <button
            type="button"
            className="rounded-r-md bg-primary px-3 py-1 text-dark transition-all duration-200 ease-in-out hover:bg-dark hover:text-light"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </form>
    </div>
  );
}
