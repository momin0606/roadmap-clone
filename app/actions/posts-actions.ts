import { createBrowserClient } from "@supabase/ssr";
import type { CreatePostSchemaType } from "~/lib/validators/postsValidators";
import { v4 as uuidv4 } from "uuid";

export const createPostAction = async (data: CreatePostSchemaType) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const userResponse = await supabase.auth.getUser();

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("id", userResponse?.data?.user?.id);
    if (!user?.data?.length) {
      throw new Error("Unauthorized");
    }
    const postId = uuidv4();
    const postResponse = await supabase.from("Post").insert({
      id: postId,
      title: data.title,
      content: data.content,
      statusId: data.statusId,
      authorId: userResponse?.data?.user?.id,
      order: data.order,
      boardId: data.boardId,
    });
    if (postResponse.error) {
      throw new Error(postResponse.error.message);
    }
    const newPostRes = await supabase.from("Post").select("*").eq("id", postId);
    return { success: true, data: newPostRes?.data?.[0] };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};

export const updatePostOrder = async (updatedPosts: any) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const userResponse = await supabase.auth.getUser();

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("id", userResponse?.data?.user?.id);
    if (!user?.data?.length) {
      throw new Error("Unauthorized");
    }
    const { data, error } = await supabase.rpc("update_posts", {
      post_updates: updatedPosts?.map((post: any) => {
        return {
          id: post.id,
          order: post.order,
          statusId: post.statusId,
        };
      }),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: { message: "Posts updated successfully" } };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};
