import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { routes } from "../../lib/client/utils";

const Index = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace(routes.home.path);
  }, [router]);

  return <div></div>;
};

export default Index;
