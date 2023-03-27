import React, { useState } from "react";
import { Button, VideoPlayer } from "../../lib/client/components";
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
import { AnimatedDiv } from "../../lib/client/components";

type Props = {};

const allStreams: MediaStream[] = []; // This captures all streams, so that they can be closed on unmounting

export default function Meet({}: Props) {
  const [meetStatus, setMeetStatus] = useState<MeetStatus>("joining");

  const {
    stream: myStream,
    micOn,
    cameraOn,
    toggleCamera,
    toggleMic,
  } = useStream({ video: true, audio: true });

  const [count, setCount] = useState(0);

  if (meetStatus === "joining") {
    return (
      <div className="flex h-screen items-center justify-evenly dark:bg-dark">
        {myStream ? (
          <JoiningTestStream
            stream={myStream}
            cameraOn={cameraOn}
            micOn={micOn}
            toggleCamera={toggleCamera}
            toggleMic={toggleMic}
          />
        ) : null}
        <div className="flex flex-1 flex-col items-center gap-y-5">
          <p className="text-lg text-light">Ready to join ?</p>
          <Button
            className="rounded-full px-10 font-semibold"
            onClick={() => setMeetStatus("joined")}
          >
            Join Meet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col  items-center justify-evenly dark:bg-dark">
      <div className="flex h-full w-full flex-wrap items-stretch justify-center  gap-5 p-5">
        {myStream &&
          Array(count)
            .fill(0)
            .map((_, idx) => {
              return (
                <VideoPlayer
                  key={idx}
                  className="min-w-[24rem] max-w-[90vw] flex-1 overflow-hidden object-cover shadow-inner md:max-w-[50vw]"
                  stream={myStream}
                />
                // <AnimatedDiv key={idx} />
              );
            })}
      </div>
      <div className=" flex w-full items-center justify-center gap-x-10 py-5 ">
        <ControlBtn on={cameraOn} onClick={toggleCamera} className="scale-125">
          {cameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
        </ControlBtn>

        <ControlBtn on={micOn} onClick={toggleMic} className="scale-125">
          {micOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
        </ControlBtn>

        <ControlBtn
          on
          onClick={() => setCount((p) => --p)}
          className="scale-125"
        >
          <p>-</p>
        </ControlBtn>

        <ControlBtn
          on
          onClick={() => setCount((p) => ++p)}
          className="scale-125"
        >
          <p>+</p>
        </ControlBtn>
      </div>
    </div>
  );
}
