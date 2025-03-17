import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import React from "react";

const UserAvatar = ({ user }: { user: any }) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className={"h-6 w-6"}>
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback className={"capitalize"}>
          {user?.name ? user.name : "?"}
        </AvatarFallback>
      </Avatar>
      <span className={"text-sm text-gray-500"}>
        {user?.name ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
