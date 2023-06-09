import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../lib/client/components";
import Hero from "../public/hero.png";
import { BiVideoPlus } from "react-icons/bi";
import { useRouter } from "next/router";
import { useSocket } from "../lib/client/contexts/SocketProvider";
import { MEET_RoomCreatedKey } from "../lib/common/utils";

type Props = {};

export default function Index({}: Props) {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const { socket, createRoom, socketConnect } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on(MEET_RoomCreatedKey, handleRoomCreation);
    return () => {
      socket.off(MEET_RoomCreatedKey, handleRoomCreation);
    };
  }, [socket]);

  const handleCreateRoom = () => {
    if (socket) {
      createRoom();
    }
  };

  const handleRoomCreation = (roomId: string) => {
    console.log("====================================");
    console.log("room created with id: ", roomId);
    console.log("====================================");
    router.push({ pathname: `/meet/${roomId}/`, query: { initiater: true } });
  };

  const handleJoinRoom = () => {
    if (roomId && socket) {
      console.log("joining room with id: ", roomId);
      return router.push(`/meet/${roomId}`);
    }
  };

  useEffect(() => {
    socketConnect();
  }, []);

  return (
    <div className="flex h-screen flex-col-reverse items-center  justify-evenly p-2 dark:bg-dark md:flex-row md:p-5">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-0 p-10  text-left text-light md:items-start md:gap-y-5">
        <h3 className="w-full text-center text-2xl font-semibold md:w-4/5 md:text-left md:text-5xl">
          Premium video meetings. Now free for everyone.
        </h3>
        <p className="mt-1 w-full text-center text-lg md:w-3/5 md:text-left">
          We re-engineered the service we built for secure business meetings,
          Google Meet, to make it free and available for all.
        </p>
        <div className="flex flex-wrap-reverse gap-5 pt-5">
          <Button
            onClick={handleCreateRoom}
            className="flex  w-full items-center justify-center gap-x-2 rounded-lg font-bold md:w-auto"
          >
            <BiVideoPlus className="text-lg" />
            <p>New Meeting</p>
          </Button>
          <span className="relative flex w-full items-center gap-x-5 md:w-auto">
            <input
              type="text"
              className="w-full rounded-md p-2 text-dark md:w-auto"
              placeholder="Enter a code or Link"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              className="absolute top-1/2 right-5 -translate-y-1/2 font-semibold text-dark hover:opacity-100 disabled:opacity-70 md:static md:translate-y-0 md:text-light"
              disabled={roomId === ""}
              onClick={handleJoinRoom}
            >
              Join
            </button>
          </span>
        </div>
      </div>
      <div className="flex  h-1/3 flex-1 items-center justify-center overflow-hidden px-5 md:h-auto">
        <Image src={Hero} alt={"hero"} className="w-full object-cover" />
      </div>
    </div>
  );
}
