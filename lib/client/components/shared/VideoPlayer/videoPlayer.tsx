import anime from "animejs";
import React, { HTMLAttributes, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  stream: MediaStream;
  classNames?: {
    container?: string;
    video?: string;
  };
  audio?: boolean;
};

export const VideoPlayer = ({ stream, classNames, audio = false }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current?.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: divRef.current,
            scale: [0, 1],
            duration: 300,
            easing: "spring(1, 100, 50 , 10)",
          });
          divRef.current && observer.unobserve(divRef.current);
        }
      });
    });
    divRef.current && observer.observe(divRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={twMerge(
        "relative flex w-full origin-center scale-0 transform items-center justify-center",
        classNames?.container
      )}
      ref={divRef}
    >
      <video
        className={twMerge(
          "pointer-events-none absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg",
          classNames?.video
        )}
        ref={videoRef}
        autoPlay
        muted={!audio}
        playsInline
        controls={false}
      ></video>
    </div>
  );
};
