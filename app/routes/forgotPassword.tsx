import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate, type MetaFunction } from "react-router";
import { toast } from "sonner";
import { forgotPasswordAction } from "~/actions/auth-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useFetch from "~/hooks/use-fetch";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from "~/lib/validators/authValidators";
import { getServerClient } from "~/server";
import type { Route } from "./+types/forgotPassword";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign In your account" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();
  if (userResponse?.data?.user) {
    throw redirect("/");
  }

  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  };
}

export default function ForgotPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const {
    loading,
    error,
    data,
    fn: ForgotPasswordFn,
  } = useFetch(forgotPasswordAction);
  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    await ForgotPasswordFn(data);
  };
  useEffect(() => {
    if (data?.data?.email) {
      toast.success(
        ` Email verificaiton link has been sent to ${data?.data.email}`
      );
      navigate("/signin");
    }
  }, [loading, data]);

  return (
    <div className="p-8 min-2-3/4 w-[500px] mx-auto">
      <h1 className="text-2xl"> Supabase Auth Forgot Password</h1>
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="min-w-24">
              Email:
            </label>
            <Input id="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
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
              Forgot Password
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
