import React, { useEffect, useRef } from "react";

type Props = { stream: MediaStream };

export const VideoPlayer = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && !videoRef.current.srcObject) {
      console.log("====================================");
      console.log("getting stream in videplayer ", stream);
      console.log("====================================");
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  return (
    <div className="w-56 h-56">
      <video className="w-full h-full" ref={videoRef} autoPlay></video>
    </div>
  );
};
