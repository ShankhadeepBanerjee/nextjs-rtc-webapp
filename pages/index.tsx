import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../lib/client/components";
import { routes } from "../lib/client/utils";
import Hero from "../public/hero.png";
import { BiVideoPlus } from "react-icons/bi";
import classNames from "classnames";
import { useRouter } from "next/router";

type Props = {};

export default function Index({}: Props) {
  const router = useRouter();
  const [meetCode, setMeetCode] = useState("");
  return (
    <div className="flex h-screen  items-center justify-evenly dark:bg-dark">
      <div className="flex flex-1 flex-col justify-center gap-y-5 p-10 text-left text-light">
        <h3 className="w-4/5 text-5xl font-semibold">
          Premium video meetings. Now free for everyone.
        </h3>
        <p className="w-3/5 text-lg">
          We re-engineered the service we built for secure business meetings,
          Google Meet, to make it free and available for all.
        </p>
        <div className="flex gap-x-5">
          <Link href={routes.meet.path}>
            <Button className="flex items-center gap-x-2 rounded-lg font-bold">
              <BiVideoPlus className="text-lg" />
              <p>New Meeting</p>
            </Button>
          </Link>
          <span className="flex items-center gap-x-5">
            <input
              type="text"
              className="rounded-md p-2 text-dark"
              placeholder="Enter a code or Link"
              value={meetCode}
              onChange={(e) => setMeetCode(e.target.value)}
            />
            <button
              className="font-semibold text-light hover:opacity-100 disabled:opacity-70"
              disabled={meetCode === ""}
              onClick={() => router.push(`${routes.meet.path}/${meetCode}`)}
            >
              join
            </button>
          </span>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-5">
        <Image src={Hero} alt={"hero"} />
      </div>
    </div>
  );
}
