import React, { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Props = {};

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Chat({}: Props) {
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      await fetch("http://localhost:3000/api/socket"); // init socket server
      socket = io();

      socket.on("connect", () => {
        console.log(socket.id);
      });

      socket.on("newIncomingMessage", (val) => {
        console.log(val);
      });
    };
    init();
  }, []);

  return (
    <>
      <div>
        <h1>This is a scocket APP</h1>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            socket.emit("createdMessage", first.current?.value);
          }}
        >
          <input type="text" ref={first} />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}
