import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_MessageReceiveKey,
  CHAT_MessageSendKey,
} from "../../lib/common/utils";
import { Loader } from "../../lib/client/components";
import { useSocket } from "../../lib/client/contexts/SocketProvider";

const NewChat = () => {
  const [chats, setChats] = useState<string[]>([]);
  const { socket, isLoading, joinRoom, leaveRoom } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };

  const roomJoinedRef = useRef(false);

  useEffect(() => {
    if (roomId && !roomJoinedRef.current) {
      joinRoom(roomId);
      roomJoinedRef.current = true;
    }
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;
    socket?.off(CHAT_MessageReceiveKey);
    socket?.on(CHAT_MessageReceiveKey, (newChat: string) => {
      console.log("Getting new message: ", newChat);
      setChats((prevChats) => [...prevChats, newChat]);
    });
  }, [socket, roomId]);

  const sendMessage = (message: string) => {
    console.log("====================================");
    console.log("Sending message: ", message);
    console.log("====================================");
    socket?.emit(CHAT_MessageSendKey, { roomId, message });
    // setChats((prevChats) => [...prevChats, message]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const message = event.currentTarget.value;
      if (message.trim()) {
        sendMessage(message);
        event.currentTarget.value = "";
      }
    }
  };

  if (isLoading) {
    return <Loader loadingText={"Connecting to socket..."} />;
  }

  return (
    <div className="flex h-screen flex-col bg-light">
      <header className="flex items-center justify-between bg-dark p-4 text-light">
        <h1 className="text-lg font-bold">Room {roomId}</h1>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-light"
          onClick={() => {
            leaveRoom(roomId);
            router.push("/");
          }}
        >
          Leave Room
        </button>
      </header>
      <main className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex-1 overflow-y-auto">
          {chats.map((chat, index) => (
            <div key={index} className="mb-2 flex flex-col">
              <span className="font-bold text-dark">NAME</span>
              <p className="break-words">{chat}</p>
            </div>
          ))}
        </div>
        <form
          className="flex items-center rounded-lg bg-white p-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            ref={inputRef}
            className="flex-1 rounded-lg border-gray-300 px-2 py-1 focus:border-primary focus:outline-none"
            type="text"
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
          />
          <button
            className="ml-2 rounded-lg bg-primary px-4 py-2 text-light"
            onClick={() => inputRef.current?.focus()}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default NewChat;
