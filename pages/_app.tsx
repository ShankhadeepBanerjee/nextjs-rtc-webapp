import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SocketProvider } from "../lib/client/contexts/SocketProvider";
import { RoutingEffectContainer } from "../lib/client/components/Containers/RoutingEffectContainer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <RoutingEffectContainer>
        <Component {...pageProps} />
      </RoutingEffectContainer>
    </SocketProvider>
  );
}

export default MyApp;
