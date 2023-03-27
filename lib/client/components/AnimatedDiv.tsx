import React, { useEffect, useRef } from "react";
import anime from "animejs";

export const AnimatedDiv = () => {
  const divRef = useRef<HTMLDivElement>(null);

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
      ref={divRef}
      className="min-w-[24rem] max-w-[48rem] flex-1 origin-center scale-0 transform bg-primary-400"
    ></div>
  );
};

export default AnimatedDiv;
