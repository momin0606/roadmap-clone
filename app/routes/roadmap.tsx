import { OrgRoles } from "constants/organization-contants";
import { useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { getServerClient } from "~/server";
import type { Route } from "./+types/roadmap";
import CreatePostDrawer from "~/components/create-post";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type OnDragEndResponder,
} from "@hello-pangea/dnd";
import PostCard from "~/components/post-card";
import useFetch from "~/hooks/use-fetch";
import { updatePostOrder } from "~/actions/posts-actions";

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
    .select("*, users(*)")
    .eq("boardId", boardRes?.data?.[0]?.id);
  console.log(JSON.stringify(posts));

  return {
    organization: organizations?.data?.[0],
    board: boardRes?.data?.[0],
    posts: posts?.data || [],
  };
}

const Roadmap = () => {
  const loaderData = useLoaderData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [posts, setPosts] = useState(loaderData.posts);
  const navigate = useNavigate();
  const {
    data: updatedPosts,
    loading: updatePostLoading,
    error: updatePostError,
    fn: updatePostOrderFn,
  } = useFetch(updatePostOrder);

  const handlePostCreated = () => {
    navigate("/dashboard/roadmap");
    // setSelectedStatus(status)
  };
  const reorder = (list: any, startIndex: number, endindex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endindex, 0, removed);
    return result;
  };

  const onDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newOrderedData = [...posts];
    console.log(newOrderedData, source.droppableId);
    const sourceList = newOrderedData.filter(
      (issue) => issue.statusId === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (issue) => issue.statusId === destination.droppableId
    );
    console.log(sourceList);
    if (source.droppableId === destination.droppableId) {
      const reorderCards = reorder(sourceList, source.index, destination.index);
      reorderCards.forEach((card: any, i) => {
        card.order = i;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.statusId = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }
    const sortedPosts = newOrderedData.sort((a, b) => a.order - b.order);
    setPosts(newOrderedData);
    //api call
    updatePostOrderFn(sortedPosts);
  };
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
                      className="space-y-2 bg-blue-500/10 p-4 py-2 rounded-lg flex flex-col gap-2 h-full"
                    >
                      <h3 className="font-semibold mb-2 text-center">
                        {status?.name}
                      </h3>
                      {posts
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
                              isDragDisabled={!!updatePostLoading}
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
                      {!posts?.filter((post: any) => {
                        return post.statusId === status.id;
                      })?.length && (
                        <p className="h-full text-center py-[50%]">
                          No Posts for status {status?.name}
                        </p>
                      )}
                      <Button
                        onClick={() => {
                          setIsDrawerOpen(true);
                          setSelectedStatus(status.id);
                        }}
                      >
                        Create Post
                      </Button>
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
