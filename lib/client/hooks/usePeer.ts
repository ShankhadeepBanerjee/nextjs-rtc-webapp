import Peer from "peerjs";
import { useEffect, useState } from "react";

export const usePeer = () => {
  const [peer, setPeer] = useState<Peer>();

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      setPeer(new Peer("asdas"));

      peer?.on("open", function (id) {
        console.log("My peer ID is: " + id);
      });
    });
  }, []);

  useEffect(() => {}, [peer]);

  return peer;
};
