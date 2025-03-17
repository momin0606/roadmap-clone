import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "~/hooks/use-fetch";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate, type MetaFunction } from "react-router";
import { toast } from "sonner";
import { signUpAction } from "~/actions/auth-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  signUpSchema,
  type SignUpSchemaType,
} from "~/lib/validators/authValidators";
import { getServerClient } from "~/server";
import type { Route } from "./+types/signin";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Sign up your account" },
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

export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const { loading, error, data, fn: signUpFn } = useFetch(signUpAction);
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpSchemaType) => {
    await signUpFn(data);
  };
  useEffect(() => {
    if (data) {
      toast.success(
        `Signup successful!, Verification email sent ${data?.data?.email}`
      );
      navigate("/signin");
    }
  }, [loading]);

  return (
    <div className="p-8 min-2-3/4 w-[500px] mx-auto">
      <h1 className="text-2xl"> Supabase Auth SignUp</h1>
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="min-w-24">
              Name:
            </label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="min-w-24">
              Email:
            </label>
            <Input id="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="min-w-24">
              Password:
            </label>
            <Input id="password" {...register("password")} type="password" />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="min-w-24">
              Confirm Password:
            </label>
            <Input
              id="confirmPassword"
              {...register("confirmPassword")}
              type="password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex flex-row justify-between mt-4 gap-4 items-center">
            <Link to="/signin" className="text-sm underline">
              Already have an account?
            </Link>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
              disabled={!!loading}
            >
              Signup
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
