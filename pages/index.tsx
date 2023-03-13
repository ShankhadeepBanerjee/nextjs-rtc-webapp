import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../lib/client/components";
type Props = {};

export default function Index({}: Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-center dark:bg-dark">
      <Button className="rounded-lg font-semibold ">+ New Meeting</Button>
    </div>
  );
}
