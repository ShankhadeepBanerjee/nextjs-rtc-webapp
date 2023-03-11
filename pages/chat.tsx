import React, { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { MessageReceiveKey, MessageSendKey } from "../lib/common/utils";

type Props = {};

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Chat({}: Props) {
  const first = useRef<HTMLInputElement>(null);

  const [chats, setChats] = useState<string[]>([]);
  const socketConnectedRef = useRef(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    const init = async () => {
      if (socketConnectedRef.current) return;
      socketConnectedRef.current = true;

      await fetch("http://localhost:3000/api/socket"); // init socket server
      socketRef.current = io();
      socketRef.current?.on("connect", () => {
        console.log("====================================");
        console.log("Socket id: ", socketRef.current?.id, socketRef.current);
        console.log("====================================");
        if (socketRef.current?.id) {
          socketRef.current?.on(MessageReceiveKey, (newChat) => {
            setChats((p) => [...p, newChat]);
          });
        }
      });
    };
    init();
    return () => {
      console.log("====================================");
      console.log("unmounting");
      console.log("====================================");
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (msg: string) => {
    console.log("====================================");
    console.log("sending ", socket, msg);
    console.log("====================================");
    socketRef.current?.emit(MessageSendKey, msg);
    setChats((p) => [...p, msg]);
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1>This is a scocket APP</h1>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            const val = first.current?.value;

            if (val) {
              sendMessage(val);
            }
          }}
          className="bg-slate-400 p-5"
        >
          <input type="text" ref={first} className="p-2" />
          <button type="submit">Send</button>
        </form>
        <div>
          {chats?.map((chat, idx) => {
            return <p key={idx}>{chat}</p>;
          })}
        </div>
      </div>
    </>
  );
}
