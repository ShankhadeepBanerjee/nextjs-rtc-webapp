import React from "react";
import Image from "next/image";
import Link from "next/link";
type Props = {};

export default function Index({}: Props) {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex gap-x-3">
        <Link href="/room2#init" className="bg-red-400 p-2">
          + Create Room
        </Link>
      </div>
      <div></div>
      <div>
        <div>
          <h1>Premium video meetings. Now free for everyone.</h1>
          <h4>
            We re-engineered the service we built for secure business meetings,
            Google Meet, to make it free and available for all.
          </h4>
          <span>
            <button>+ New Meeting</button>
          </span>
          <div>
            <a href="">Learn more, </a>
            <span>about google meet</span>
          </div>
        </div>
        <div>
          <Image src={""} alt={""} />
          <div>Get a link you can share</div>
          <div>
            Click <strong>New meeting</strong> to get a link you can send to
            people you want to meet with
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
