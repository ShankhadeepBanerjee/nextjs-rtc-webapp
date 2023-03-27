import React from "react";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";
import { VideoPlayer, ControlBtn } from "./shared";

type Props = {
  stream: MediaStream;
  cameraOn: boolean;
  micOn: boolean;
  toggleCamera: () => void;
  toggleMic: () => void;
};

export const JoiningTestStream = ({
  stream,
  cameraOn,
  micOn,
  toggleCamera,
  toggleMic,
}: Props) => {
  return (
    <div className="relative flex h-2/3 flex-1 overflow-hidden p-10">
      {stream && <VideoPlayer className="  shadow-inner" stream={stream} />}
      <div className="absolute bottom-0 flex w-full items-center justify-center gap-x-10 py-4 ">
        <ControlBtn on={cameraOn} onClick={toggleCamera} className="scale-125">
          {cameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
        </ControlBtn>

        <ControlBtn on={micOn} onClick={toggleMic} className="scale-125">
          {micOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
        </ControlBtn>
      </div>
    </div>
  );
};
