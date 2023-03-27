import anime from "animejs";
import classnames from "classnames";
import React, { HTMLAttributes, useEffect, useRef } from "react";

type Props = {
  stream: MediaStream;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  audio?: boolean;
};

export const VideoPlayer = ({ stream, className, audio = false }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stream && !videoRef.current.srcObject) {
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
      className={classnames("origin-center scale-0 transform", className)}
      ref={divRef}
    >
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
