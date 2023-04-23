import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_MessageReceiveKey,
  CHAT_MessageSendKey,
} from "../../lib/common/utils";
import { Button, Loader } from "../../lib/client/components";
import { useSocket } from "../../lib/client/contexts/SocketProvider";
import classnames from "classnames";
import { MdContentCopy } from "react-icons/md";

const NewChat = () => {
  const [chats, setChats] = useState<string[]>([]);
  const { socket, isLoading, joinRoom, leaveRoom } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const { socketDisconnect, isConnected } = useSocket();
  const router = useRouter();
  const { roomId } = router.query as { roomId: string };
  const [isCopied, setIsCopied] = useState(false);

  const roomJoinedRef = useRef(false);

  useEffect(() => {
    if (!isConnected) router.push("/chat");
  }, [isConnected]);

  useEffect(() => {
    if (router.isReady && !roomId) {
      router.push("/");
    }

    if (roomId && !roomJoinedRef.current) {
      joinRoom(roomId);
      roomJoinedRef.current = true;
    }
  }, [joinRoom, roomId, router]);

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
    inputRef.current?.focus();
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  if (isLoading) {
    return <Loader loadingText={"Connecting to socket..."} />;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-[10vh] items-center justify-between bg-dark p-4 text-light">
        <span className="flex items-center gap-1">
          <p className="rounded-lg p-2 text-sm text-light">Room ID:</p>

          <button
            className="ml-2 flex items-center gap-2 rounded-lg bg-transparent px-4 py-1 text-sm outline-1 outline-light"
            onClick={handleCopyClick}
          >
            <MdContentCopy className="text-light" />
            <p className="rounded-lg text-lg font-bold">{roomId}</p>
            <span
              className={classnames(
                "h-2 w-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )}
            />
            <p className="text-light">{isCopied ? "Copied!" : null}</p>
          </button>
        </span>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-dark"
          onClick={() => {
            leaveRoom(roomId);
            socketDisconnect();
            router.push("/");
          }}
        >
          Leave Room
        </button>
      </header>

      <main className="flex h-[70vh] flex-1 gap-2 bg-dark p-4">
        <div className="flex flex-[6] items-center justify-center rounded-lg bg-light"></div>
        <div className="relative flex w-96 flex-col justify-between gap-1 overflow-hidden rounded-md bg-light p-4">
          <button></button>
          <div className="w-full flex-1 overflow-y-auto pb-2">
            {chats.map((chat, index) => (
              <div key={index} className="mb-2 flex flex-col">
                <span className="font-bold text-dark">NAME</span>
                <p className="break-words">{chat}</p>
              </div>
            ))}
          </div>
          <div className="h-16 w-full">
            <form
              className="flex items-center rounded-lg bg-white p-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (inputRef.current?.value) {
                  sendMessage(inputRef.current?.value);
                  inputRef.current.value = "";
                }
              }}
            >
              <input
                ref={inputRef}
                className="flex-1 rounded-lg  p-1  focus:border-primary focus:outline-none"
                type="text"
                placeholder="Type your message..."
              />
              <Button className="rounded-lg">Send</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewChat;
