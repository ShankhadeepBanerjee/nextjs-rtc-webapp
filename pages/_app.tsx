import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SocketProvider } from "../lib/client/contexts/SocketProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}

export default MyApp;
