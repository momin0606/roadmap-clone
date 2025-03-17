import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "~/hooks/use-fetch";
import { useForm } from "react-hook-form";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from "react-router";
import { toast } from "sonner";
import { updatePasswordAction } from "~/actions/auth-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  updatePasswordSchema,
  type UpdatePasswordSchemaType,
} from "~/lib/validators/authValidators";
import { getServerClient } from "~/server";
import type { Route } from "./+types/updatePassword";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign In your account" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const code = request?.url?.split("?code=")?.[1];

  let userSession = await sbServerClient.auth.exchangeCodeForSession(code);

  return {
    userSession: userSession,
  };
}

export default function UpdatePassword() {
  const { userSession } = useLoaderData();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });
  const {
    loading,
    error,
    data,
    fn: updatePasswordFn,
  } = useFetch(updatePasswordAction);
  const navigate = useNavigate();

  const onSubmit = async (data: UpdatePasswordSchemaType) => {
    await updatePasswordFn({
      password: data.password,
      email: userSession?.data?.user?.email,
      refreshToken: userSession?.data?.session?.refresh_token,
    });
    navigate("/");
  };
  useEffect(() => {
    console.log({ data });
    if (data?.data?.email) {
      toast.success(`Password updated successfully for ${data?.data.email}`);
      navigate("/");
    }
  }, [loading, data]);

  return (
    <div className="p-8 min-2-3/4 w-[500px] mx-auto">
      <h1 className="text-2xl"> Supabase Auth Update Password</h1>
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="min-w-24">
              Password:
            </label>
            <Input type="password" id="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-row justify-between mt-4 gap-4 items-center">
            <Link to="/signup" className="text-sm underline">
              Don't have an account?
            </Link>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
              disabled={!!loading}
            >
              Update Password
            </Button>
          </div>
          {error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4">{error.message}</p>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
