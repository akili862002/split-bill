"use client";

import { User } from "@prisma/client";
import { Tooltip } from "react-tooltip";

interface IAvatarsProps {
  users: User[];
}

export const Avatars: React.FC<IAvatarsProps> = ({ users }) => {
  return (
    <>
      <div className="flex">
        {users.map((user, index) => (
          <img
            key={user.id}
            data-tooltip-id="user"
            data-tooltip-content={user.fullName}
            src={user.avatar}
            alt=""
            className="rounded-full w-8 h-8 border border-white"
            style={{
              transform: `translateX(-${index * 4}px)`,
            }}
            title={user.fullName}
          />
        ))}
        <Tooltip id="user" />
      </div>
    </>
  );
};
