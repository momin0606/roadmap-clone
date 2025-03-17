import { zodResolver } from "@hookform/resolvers/zod";
// import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPostAction } from "~/actions/posts-actions";
import useFetch from "~/hooks/use-fetch";
import {
  createPostSchema,
  type CreatePostSchemaType,
} from "~/lib/validators/postsValidators";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { Input } from "../components/ui/input";

type CreatePostDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  orgId?: string;
  boardId?: string;
  statusId: string;
  order: number;
};

const CreatePostDrawer = ({
  isOpen,
  onClose,
  onPostCreated,
  boardId,
  statusId,
  order,
}: CreatePostDrawerProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, defaultValues },
    reset,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      boardId,
      statusId,
      order,
    },
  });
  useEffect(() => {
    reset({
      boardId,
      statusId,
      order,
    });
  }, [order, statusId, boardId]);

  const {
    loading: createPostLoading,
    fn: createPostFn,
    error,
    data,
  } = useFetch(createPostAction);

  const onSubmit = async (data: CreatePostSchemaType) => {
    await createPostFn(data);
  };

  useEffect(() => {
    if (data?.data?.id) {
      reset();
      onClose();
      onPostCreated();
      toast.success("Post created successfully");
    }
  }, [data, createPostLoading]);
  console.log(error, errors, defaultValues, statusId);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className={"pb-10"}>
        <DrawerHeader>
          <DrawerTitle>Create New Post</DrawerTitle>
          <DrawerDescription>Create post in {statusId}</DrawerDescription>
        </DrawerHeader>
        <form
          className="flex flex-col p-4 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Input id="content" {...register("content")} />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          {/* <div className="w-full">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => {
                return (
                  <MDEditor value={field.value} onChange={field.onChange} />
                );
              }}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div> */}

          <Button
            type="submit"
            disabled={!!createPostLoading}
            className="w-full"
          >
            {createPostLoading ? "Creating Post..." : "Create Post"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreatePostDrawer;
