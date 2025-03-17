import { OrgRoles } from "constants/organization-contants";
import { useState } from "react";
import { redirect, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { getServerClient } from "~/server";
import type { Route } from "./+types/roadmap";
import CreatePostDrawer from "~/components/create-post";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PostCard from "~/components/post-card";

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();
  if (!userResponse?.data?.user) {
    redirect("/signin");
  }
  const organizations = await sbServerClient
    .from("OrganizationUser")
    .select("*, Organization(*)")
    .eq("active", true)
    .eq("userId", userResponse?.data?.user?.id || "");
  if (!organizations?.data?.length) {
    return redirect("/onboarding");
  }

  const boardRes = await sbServerClient
    .from("Board")
    .select("*, Status(*)")
    .eq("organizationId", organizations?.data?.[0]?.Organization?.id);

  const posts = await sbServerClient
    .from("Post")
    .select("*")
    .eq("boardId", boardRes?.data?.[0]?.id);

  return {
    organization: organizations?.data?.[0],
    board: boardRes?.data?.[0],
    posts: posts?.data,
  };
}

const Roadmap = () => {
  const loaderData = useLoaderData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const handlePostCreated = () => {
    // setSelectedStatus(status)
  };

  const onDragEnd = () => {};
  console.log({ selectedStatus });
  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Road Map</h1>
            <h3 className="text-md font-semibold">{loaderData?.board?.name}</h3>
          </div>
          <div>
            {(loaderData?.organization?.role === OrgRoles?.OWNER ||
              loaderData?.organization?.role === OrgRoles?.ADMIN) && (
              <Button
                onClick={() => {
                  setIsDrawerOpen(true);
                  setSelectedStatus(loaderData?.board?.Status?.[0]?.id);
                }}
              >
                Create Post
              </Button>
            )}
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {loaderData?.board?.Status?.map((status: any) => {
            return (
              <Droppable key={status?.id} droppableId={status?.id}>
                {(provided) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 bg-blue-500/10 p-4 py-2 rounded-lg flex flex-col gap-2"
                    >
                      <h3 className="font-semibold mb-2 text-center">
                        {status?.name}
                      </h3>
                      {loaderData?.posts
                        ?.filter((post: any) => {
                          console.log({ post, status });
                          return post.statusId === status.id;
                        })
                        ?.map((post: any, index: number) => {
                          return (
                            <Draggable
                              key={post.id}
                              draggableId={post.id}
                              index={index}
                              // isDragDisabled={updatePostLoading}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <PostCard
                                      post={post}
                                      onDelete={
                                        () => {}
                                        // fetchPosts(currentSprint.id)
                                      }
                                      onUpdate={(updated: any) => {
                                        // setPosts((posts) => {
                                        //   return posts.map((post) => {
                                        //     if (post.id === updated.id) {
                                        //       return updated;
                                        //     }
                                        //     return post;
                                        //   });
                                        // });
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
      <CreatePostDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onPostCreated={handlePostCreated}
        boardId={loaderData.board?.id}
        statusId={selectedStatus}
        order={0}
      />
    </>
  );
};

export default Roadmap;
