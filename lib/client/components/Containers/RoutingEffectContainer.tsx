import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
};

const useRouteChanging = () => {
  const router = useRouter();
  const [changing, setChanging] = useState(false);

  const handleRouteChangeStart = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (shallow) return;
    setChanging(true);
  };

  const handleRouteChangeComplete = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (shallow) return;
    setChanging(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  return changing;
};

export const RoutingEffectContainer = (props: Props) => {
  const changing = useRouteChanging();

  return (
    <div
      className={twMerge(
        "relative overflow-hidden",
        changing ? "pointer-events-none animate-pulse" : ""
      )}
    >
      <Transition
        as={Fragment}
        show={changing}
        enter="transition-transform transition-opacity z-10 duration-1000"
        enterFrom="-translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-transform transition-opacity duration-1000"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        <div className="absolute left-0 top-0 z-20 h-1 w-full rounded-lg bg-primary"></div>
      </Transition>

      {props.children}
    </div>
  );
};
