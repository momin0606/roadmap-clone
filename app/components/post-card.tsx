import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import React, { useState } from "react";
import UserAvatar from "../components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
// import PostDetailsDialog from "./Post-details-dialog";
const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

const priorityColorBg = {
  LOW: "bg-green-600",
  MEDIUM: "bg-yellow-300",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-400",
};

const PostCard = ({
  post,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: {
  post: any;
  showStatus?: boolean;
  onDelete?: Function;
  onUpdate?: Function;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const created = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const navigate = useNavigate();
  const onDeleteHandler = (...params: any) => {
    navigate("/dashboard/roadmap");
    onDelete(...params);
  };
  const onUpdateHandler = (...params: any) => {
    navigate("/dashboard/roadmap");
    onUpdate(...params);
  };
  return (
    <>
      <Card
        className={
          "cursor-pointer hover:shadow-md transition-shadow py-0 bg-gray-700"
        }
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className={`border-t-2 border-t-black rounded-lg pt-6`}>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent className={"flex gap-2 -mt-3"}>
          {/* {showStatus && <Badge>{post.status}</Badge>} */}
          {/* <Badge
            variant={"outline"}
            className={`-ml-1 ${priorityColorBg[post.priority]}`}
          >
            {post.priority}
          </Badge> */}
        </CardContent>
        <CardFooter className={"flex flex-col items-start space-y-3 pb-6"}>
          <UserAvatar user={post.Author?.name} />
          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>
      {/* {isDialogOpen && (
        <PostDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          Post={Post}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderColor={priorityColor[post.priority]}
        />
      )} */}
    </>
  );
};

export default PostCard;
