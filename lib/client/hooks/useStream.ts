import { useCallback, useEffect, useRef, useState } from "react";
import { createTrack } from "../utils";

const allStreams: MediaStream[] = []; // This captures all streams, so that they can be closed on unmounting

export const useStream = (constraints: MediaStreamConstraints) => {
  const streamRef = useRef(false);
  const [stream, setStream] = useState<MediaStream>();

  const [cameraOn, setCamerOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const initiateStream = useCallback(async () => {
    const _stream = await navigator.mediaDevices.getUserMedia(constraints);
    setStream(_stream);
    allStreams.push(_stream);
  }, []);

  const toggleCamera = async () => {
    if (stream) {
      const tracks = stream.getVideoTracks();
      if (tracks.length !== 0 && tracks[0].readyState === "live") {
        tracks[0].stop();
        stream.removeTrack(tracks[0]);
      } else {
        const newTrack = await createTrack({ video: true });
        stream.addTrack(newTrack);
      }
      setCamerOn((p) => !p);
    }
  };

  const toggleMic = () => {
    if (stream) {
      const track = stream.getAudioTracks()[0];
      track.enabled = !track?.enabled;
      setMicOn((p) => !p);
    }
  };

  // Initiates Users Stream
  useEffect(() => {
    if (streamRef.current) return;
    streamRef.current = true;
    initiateStream();

    return () => {
      allStreams?.forEach((strm) =>
        strm?.getTracks()?.forEach((track) => {
          track?.stop();
          strm.removeTrack(track);
        })
      );
    };
  }, [initiateStream]);

  return {
    stream,
    cameraOn,
    micOn,
    toggleCamera,
    toggleMic,
  };
};
