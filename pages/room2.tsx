import React, { useCallback, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { VideoPlayer } from "../lib/client/components";
import { Stream } from "stream";

type Props = {};
export default function Room2({}: Props) {
  const [peer, setPeer] = useState<Peer.Instance>();

  const [myStream, setMyStream] = useState<MediaStream>();
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

  const InitiatePeer = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    //   peer?.addStream(mediaStream);
    setMyStream(mediaStream);
    const newPeer = new Peer({
      initiator: location.hash === "#init",
      trickle: false,
      stream: mediaStream,
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

      <div className="flex">
        {myStream && (
          <VideoPlayer className="flex-1 max-w-[24rem]" stream={myStream} />
        )}
        {peerStream && (
          <VideoPlayer
            className="flex-1 max-w-[24rem]"
            stream={peerStream}
            audio={true}
          />
        )}
      </div>
    </div>
  );
}
