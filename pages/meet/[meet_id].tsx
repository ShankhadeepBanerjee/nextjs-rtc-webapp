import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, VideoPlayer } from "../../lib/client/components";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";
import { ControlBtn } from "../../lib/client/components";
import { createTrack } from "../../lib/client/utils";

type Props = {};

const allStreams: MediaStream[] = []; // This captures all streams, so that they can be closed on unmounting

export default function Index({}: Props) {
  const streamRef = useRef(false);
  const [myStream, setMyStream] = useState<MediaStream>();

  const [camerOn, setCamerOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const initiateStream = useCallback(
    async (constraints?: MediaStreamConstraints) => {
      const _stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMyStream(_stream);
      allStreams.push(_stream);
    },
    []
  );

  const toggleCamera = async () => {
    if (myStream) {
      const tracks = myStream.getVideoTracks();
      if (tracks.length !== 0 && tracks[0].readyState === "live") {
        tracks[0].stop();
        myStream.removeTrack(tracks[0]);
      } else {
        const newTrack = await createTrack({ video: true });
        myStream.addTrack(newTrack);
      }
      setCamerOn((p) => !p);
    }
  };

  const toggleMic = () => {
    if (myStream) {
      const track = myStream.getAudioTracks()[0];
      track.enabled = !track?.enabled;
      setMicOn((p) => !p);
    }
  };

  // Initiates Users Stream
  useEffect(() => {
    if (streamRef.current) return;
    streamRef.current = true;
    initiateStream({ video: true, audio: true });

    return () => {
      allStreams?.forEach((strm) =>
        strm?.getTracks()?.forEach((track) => {
          track?.stop();
          strm.removeTrack(track);
        })
      );
    };
  }, [initiateStream]);

  return (
    <div className="flex h-screen items-center justify-evenly  dark:bg-dark">
      <div className="relative ">
        <div>
          {myStream && (
            <VideoPlayer
              className="max-w-[36rem] flex-1 shadow-inner"
              stream={myStream}
            />
          )}
        </div>
        <div className="absolute bottom-0 flex w-full items-center justify-center gap-x-10 py-4 ">
          <ControlBtn on={camerOn} onClick={toggleCamera} className="scale-125">
            {camerOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
          </ControlBtn>

          <ControlBtn on={micOn} onClick={toggleMic} className="scale-125">
            {micOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
          </ControlBtn>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-5">
        <p className="text-lg text-light">Ready to join ?</p>
        <Button className="rounded-full px-10 font-semibold">Join Meet</Button>
      </div>
    </div>
  );
}
