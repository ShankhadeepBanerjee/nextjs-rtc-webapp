import React, { HTMLAttributes, useEffect, useRef } from "react";

type Props = {
  stream: MediaStream;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  audio?: boolean;
};

export const VideoPlayer = ({ stream, className, audio = false }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  return (
    <div className={className}>
      <video
        className="pointer-events-none h-full w-full rounded-lg"
        ref={videoRef}
        autoPlay
        muted={!audio}
        playsInline
        controls={false}
      ></video>
    </div>
  );
};
