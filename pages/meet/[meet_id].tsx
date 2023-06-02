import React, { useEffect, useRef, useState } from "react";
import { Button, Loader, VideoPlayer } from "../../lib/client/components";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";
import { ControlBtn } from "../../lib/client/components";
import { MeetStatus } from "../../lib/client/types";
import { useStream } from "../../lib/client/hooks";
import { JoiningTestStream } from "../../lib/client/components/JoiningTestStream";
import { useRouter } from "next/router";
import classnames from "classnames";
import { MdCall, MdContentCopy } from "react-icons/md";
import { useSocket } from "../../lib/client/contexts/SocketProvider";
import {
  MEET_ReceivePeerAnswerKey,
  MEET_ReceivePeerOfferKey,
  MEET_SendPeerAnswerKey,
  MEET_SendPeerOfferKey,
} from "../../lib/common/utils";
import SimplePeer from "simple-peer";
import {
  PeerAnserReceiveProps,
  PeerOfferReceiveProps,
} from "../../lib/common/types";
import { twMerge } from "tailwind-merge";
import { ImSpinner8 } from "react-icons/im";

type Props = {};

const createPeer = (options: SimplePeer.Options) => {
  const newPeer = new SimplePeer({
    ...options,
    trickle: false,
    config: {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    },
  });

  return newPeer;
};

export default function Meet({}: Props) {
  const router = useRouter();
  const { meet_id: roomId } = router?.query as { meet_id: string };
  const {
    isLoading: isSocketLoading,
    joinRoom,
    isConnected,
    socket,
    socketConnect,
  } = useSocket();
  const [isCopied, setIsCopied] = useState(false);
  const [meetStatus, setMeetStatus] = useState<MeetStatus>("joining");
  const [peerStream, setPeerStream] = useState<MediaStream | null>(null);
  const [askingToJoin, setAskingToJoin] = useState(false);
  const peerRef = useRef<SimplePeer.Instance | null>(null);

  const {
    stream: myStream,
    micOn,
    cameraOn,
    toggleCamera,
    toggleMic,
  } = useStream({ video: true, audio: true });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  useEffect(() => {
    if (!roomId) return;
    if (router?.query?.initiater) {
      setMeetStatus("joined");
      joinRoom(roomId);
    } else {
      setMeetStatus("joining");
      joinRoom(roomId);
    }
  }, [router.query, roomId]);

  const handleJoinCall = async () => {
    setAskingToJoin(true);
    const newPeer = createPeer({
      stream: myStream,
      initiator: true,
    });

    peerRef.current = newPeer;
    newPeer.on("signal", (signal) => {
      // if (signal?.type === "offer") {
      socket?.emit(MEET_SendPeerOfferKey, { roomId, offer: signal });
      // }
    });
    newPeer.on("error", (err) => {
      console.log("error", err);
    });
    newPeer.on("close", () => {
      console.log("closeed XXXXXXXXXXXX");
      setPeerStream(null);
    });
    newPeer.on("connect", () => {
      newPeer.send("Hello I am receiver");
      setMeetStatus("joined");
      setAskingToJoin(false);
    });
    newPeer.on("data", (data) => {
      console.log(data.toString());
    });
    newPeer.on("stream", (stream) => {
      setPeerStream(stream);
    });
  };

  const handlePeerAnswerReceive = ({ answer }: PeerAnserReceiveProps) => {
    peerRef.current?.signal(answer);
  };

  const handlePeerOfferReceive = async ({ offer }: PeerOfferReceiveProps) => {
    const answer = confirm(
      "Someone wants to join your meet, do you want to join? (Y/N)"
    );
    console.log(answer);

    if (!answer) return;
    const newPeer = createPeer({
      stream: myStream,
    });
    peerRef.current = newPeer;
    newPeer.on("signal", (signal) => {
      // if (signal?.type === "answer") {
      socket?.emit(MEET_SendPeerAnswerKey, { roomId, answer: signal });
      // }
    });
    newPeer.on("error", (err) => {
      console.log("error", err);
    });
    newPeer.on("close", () => {
      console.log("closed XXXXXXXXXXXX");
      setPeerStream(null);
    });
    newPeer.on("connect", () => {
      newPeer.send("Hello I am initiater");
    });
    newPeer.on("data", (data) => {
      console.log(data.toString());
    });
    newPeer.on("stream", (stream) => {
      setPeerStream(stream);
    });

    newPeer.signal(offer);
  };

  useEffect(() => {
    if (!socket && !router?.query?.initiater) return;

    socket?.on(MEET_ReceivePeerAnswerKey, handlePeerAnswerReceive);

    return () => {
      socket?.off(MEET_ReceivePeerAnswerKey, handlePeerAnswerReceive);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket && router?.query?.initiater) return;

    if (myStream) {
      socket?.on(MEET_ReceivePeerOfferKey, handlePeerOfferReceive);
    }
    return () => {
      socket?.off(MEET_ReceivePeerOfferKey, handlePeerOfferReceive);
    };
  }, [socket, myStream]);

  useEffect(() => {
    socketConnect();
  }, [socket]);

  useEffect(() => {
    return () => {
      peerRef.current?.destroy();
    };
  }, []);

  if (isSocketLoading) {
    return <Loader loadingText={"Connecting to socket..."} />;
  }

  if (meetStatus === "joining") {
    return (
      <div className="flex h-screen flex-col flex-wrap  items-center justify-evenly dark:bg-dark lg:flex-row">
        {myStream ? (
          <JoiningTestStream
            stream={myStream}
            cameraOn={cameraOn}
            micOn={micOn}
            toggleCamera={toggleCamera}
            toggleMic={toggleMic}
          />
        ) : null}
        <div className="flex w-full flex-1 flex-col items-center gap-y-5 lg:w-auto">
          {askingToJoin ? (
            <div className="flex items-center pt-5">
              <ImSpinner8 className="mb-2 animate-spin text-3xl text-primary-200" />
            </div>
          ) : (
            <>
              <p className="text-lg text-light">Ready to join?</p>
              <Button
                className="rounded-full px-10 font-semibold"
                onClick={handleJoinCall}
              >
                Join Meet
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-evenly p-2 dark:bg-dark">
      <span className="flex items-center gap-1 rounded-full bg-light">
        <p className="rounded-lg p-2 text-sm font-semibold text-dark">
          Room ID:
        </p>

        <button
          className="ml-2 flex items-center gap-2 rounded-lg bg-transparent px-4 py-1 text-sm outline-1 outline-light"
          onClick={handleCopyClick}
        >
          <MdContentCopy className="text-dark" />
          <p className="rounded-lg text-lg font-bold">{roomId}</p>
          <span
            className={classnames(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-red-500"
            )}
          />
          <p className="text-dark">{isCopied ? "Copied!" : null}</p>
        </button>
      </span>
      <div className="relative flex h-full w-full flex-wrap items-stretch justify-center gap-5 p-2 md:p-5">
        {peerStream ? (
          <VideoPlayer
            classNames={{
              container: twMerge(
                "h-full w-full",
                "max-w-[90vw] overflow-hidden object-cover shadow-inner md:h-auto md:max-w-[50vw] md:flex-1"
              ),
            }}
            stream={peerStream}
            audio
          />
        ) : null}
        {myStream ? (
          <VideoPlayer
            classNames={{
              container: twMerge(
                peerStream
                  ? "absolute bottom-0 right-3 h-1/3 w-1/3 md:static md:h-auto md:w-auto overflow-hidden"
                  : "",
                "md:w-auto max-w-[90vw] overflow-hidden  shadow-inner md:max-w-[50vw] md:flex-1"
              ),
              video: twMerge("w-full"),
            }}
            stream={myStream}
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
          className="rounded-full bg-red-600  p-3 text-white hover:bg-red-400 active:bg-red-700"
        >
          <MdCall />
        </Button>
      </div>
    </div>
  );
}
