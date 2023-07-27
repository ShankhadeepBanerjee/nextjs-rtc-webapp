import { useState } from "react";
import SimplePeer from "simple-peer"; // Replace with the actual function to fetch your TURN credentials
import { getTURNCreds } from "../services";

export const useCreatePeer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPeer = async (options: SimplePeer.Options) => {
    setIsLoading(true);
    setError(null);

    let newPeer = null;
    try {
      const turnCreds = await getTURNCreds();

      newPeer = new SimplePeer({
        ...options,
        trickle: true,
        config: {
          iceServers: turnCreds,
        },
      });

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "Failed to create peer.");
    }
    return newPeer;
  };

  return {
    createPeer,
    isLoading,
    error,
  };
};
