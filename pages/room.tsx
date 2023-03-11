import React, { useEffect, useState } from "react";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { useRouter } from "next/router";
import { VideoPlayer } from "../lib/client/components";

type Props = {};

export default function Room({}: Props) {
  const [peer, setPeer] = useState<Peer>();
  const [callId, setCallId] = useState<string>();
  const router = useRouter();

  const [myStream, setMyStream] = useState<MediaStream>();
  const [peerStream, setPeerStream] = useState<MediaStream>();

  const [data, setData] = useState<{
    peer_id?: string;
  }>();

  useEffect(() => {
    if (router.query?.peer_id) {
      setData({
        peer_id: router.query?.peer_id as string,
      });
    }
  }, [router]);

  useEffect(() => {
    data?.peer_id &&
      import("peerjs").then(({ default: Peer }) => {
        const newPeer = new Peer(data?.peer_id as string);
        setPeer(newPeer);

        newPeer.on("connection", function (conn) {
          console.log("====================================");
          console.log("Peer connected successfully, peer id: ", conn.peer);
          console.log("====================================");

          conn?.on("data", function (data) {
            console.log(data);
          });
        });

        newPeer.on("call", answerCall);
      });

    return () => {
      peer?.disconnect();
    };
  }, [data]);

  const makePeerConnection = (peer_id: string) => {
    if (peer) {
      const conn = peer.connect(peer_id);

      conn?.on("open", function () {
        conn?.send("hi!");
      });
    } else {
      console.log("====================================");
      console.log("No peer object found");
      console.log("====================================");
    }
  };

  const dialCall = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setMyStream(mediaStream);
    if (callId && mediaStream) {
      const call = peer?.call(callId, mediaStream);
      call?.on("stream", function (remoteStream) {
        setPeerStream(remoteStream);
      });
    }
  };

  const answerCall = async (call: MediaConnection) => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(mediaStream);
    call.answer(mediaStream);
    call.on("stream", (remoteStream) => {
      setPeerStream(remoteStream);
    });
  };

  return (
    <div>
      <p>Peer ID: {peer?.id}</p>

      <div>
        <input
          type="text"
          placeholder="Call id"
          onChange={(e) => setCallId(e.target.value)}
        />
        <button
          className="bg-slate-400 p-4 rounded shadow-lg active:shadow-none"
          onClick={() => {
            if (callId) {
              makePeerConnection(callId);
            }
          }}
        >
          Connect
        </button>
      </div>

      <div>
        <button
          className="bg-slate-400 p-4 rounded shadow-lg active:shadow-none"
          onClick={dialCall}
        >
          Start Video Call
        </button>
      </div>

      <div>
        {myStream && <VideoPlayer stream={myStream} />}

        {peerStream && <VideoPlayer stream={peerStream} />}
      </div>
    </div>
  );
}
