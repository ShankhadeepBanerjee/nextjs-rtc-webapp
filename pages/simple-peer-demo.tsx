import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Button, ControlBtn, VideoPlayer } from "../lib/client/components";
import { useStream } from "../lib/client/hooks";
import router from "next/router";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";

type Props = {};
export default function Room2({}: Props) {
  const [peer, setPeer] = useState<Peer.Instance>();

  // const [myStream, setMyStream] = useState<MediaStream>();
  const [peerStream, setPeerStream] = useState<MediaStream>();

  const [peerData, setpeerData] = useState<Peer.SignalData>();
  const [otherPeerData, setOtherPeerData] = useState<Peer.SignalData>();

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<string[]>([]);

  const alreadyPeerInit = useRef(false);

  //   const dialCall = async () => {
  //     const mediaStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     peer?.addStream(mediaStream);
  //     setMyStream(mediaStream);
  //   };
  const {
    stream: myStream,
    cameraOn,
    micOn,
    toggleCamera,
    toggleMic,
  } = useStream({
    video: true,
    audio: true,
  });

  const InitiatePeer = async () => {
    const newPeer = new Peer({
      initiator: location.hash === "#init",
      trickle: false,
      stream: myStream,
    });
    setPeer(newPeer);

    newPeer.on("signal", (data) => {
      console.log("====================================");
      console.log("Got signal", data);
      console.log("====================================");
      setpeerData(data);
    });

    newPeer.on("connect", () => {
      console.log("====================================");
      console.log("Got Connected ");
      console.log("====================================");
    });

    newPeer.on("data", (m) => {
      console.log("====================================");
      console.log(m.toString());
      console.log("====================================");
      setMessages((p) => [...p, m.toString()]);
    });

    newPeer.on("stream", (stream) => {
      console.log("====================================");
      console.log("getting stream");
      console.log("====================================");
      setPeerStream(stream);
    });
  };

  useEffect(() => {
    if (alreadyPeerInit.current) return;
    alreadyPeerInit.current = true;
    InitiatePeer();
  }, []);

  return (
    <div>
      <label>PeerData:</label>
      <br />
      <textarea
        className="w-full bg-slate-200"
        value={JSON.stringify(peerData)}
        onChange={(e) => setpeerData(JSON.parse(e.target.value))}
      ></textarea>
      <br />

      <label>OtherPeerData:</label>
      <br />
      <textarea
        className="w-full bg-slate-200"
        id="otherId"
        value={JSON.stringify(otherPeerData)}
        onChange={(e) => setOtherPeerData(JSON.parse(e.target.value))}
      ></textarea>
      {!peer?.destroyed ? (
        <button
          className="bg-orange-400 p-2 font-semibold"
          id="connect"
          onClick={() => {
            if (otherPeerData) {
              peer?.signal(otherPeerData);
            }
          }}
        >
          connect
        </button>
      ) : null}
      <br />

      <textarea ref={messageRef}></textarea>
      <button
        onClick={() => {
          if (messageRef.current?.value) {
            peer?.send(messageRef.current?.value);
          }
        }}
      >
        Send
      </button>
      <div className="flex flex-col">
        {messages?.map((m, idx) => (
          <p key={idx}>{m}</p>
        ))}
      </div>

      {/* <button className="bg-orange-400 p-2 font-semibold" onClick={dialCall}>
        Call
      </button> */}

      <div className="flex h-screen w-full flex-wrap items-stretch justify-center gap-5 p-5">
        {myStream ? (
          <VideoPlayer
            classNames={{
              container:
                "min-w-[24rem] max-w-[90vw] flex-1 overflow-hidden object-cover shadow-inner md:max-w-[50vw]",
            }}
            stream={myStream}
          />
        ) : null}
        {peerStream ? (
          <VideoPlayer
            classNames={{
              container:
                "min-w-[24rem] max-w-[90vw] flex-1 overflow-hidden object-cover shadow-inner md:max-w-[50vw]",
            }}
            stream={peerStream}
          />
        ) : null}
      </div>
      <div className=" flex w-full items-center justify-center gap-x-10 py-5 ">
        <ControlBtn on={cameraOn} onClick={toggleCamera} className="scale-125">
          {cameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
        </ControlBtn>
        <ControlBtn on={micOn} onClick={toggleMic} className="scale-125">
          {micOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
        </ControlBtn>
        <Button
          onClick={() => router.push("/")}
          className="bg-red-600 text-white hover:bg-red-500 focus:bg-red-500"
        >
          Leave Meet
        </Button>
      </div>
    </div>
  );
}
