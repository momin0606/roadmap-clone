import {
  Form,
  Link,
  redirect,
  useNavigate,
  type MetaFunction,
} from "react-router";
import { getServerClient } from "~/server";
import type { Route } from "./+types/signin";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

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
    throw redirect("/home");
  }

  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  };
}
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const dataFields = Object.fromEntries(formData.entries());
  const sbServerClient = getServerClient(request);
  try {
    const { data, error } = await sbServerClient.auth.signUp({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });
    if (error) {
      console.log(error);
      return { error: error.message };
    }
    return { user: data.user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return {
      error: "An error occurred",
    };
  }
}

export default function Signup({ loaderData }: Route.ComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const { env } = loaderData;
  const navigate = useNavigate();

  return (
    <div className="p-8 min-2-3/4 w-[500px] mx-auto">
      <h1 className="text-2xl"> Supabase Auth SignUp</h1>
      <Form method="post" className="mt-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label htmlFor="email" className="min-w-24">
              Email:
            </label>
            <Input
              id="email"
              className="flex-1"
              type="email"
              name="email"
              placeholder="Enter you email"
            />
          </div>

          <div className="flex flex-row">
            <label htmlFor="password" className="min-w-24">
              Password:
            </label>
            <Input
              id="password"
              className="flex-1"
              type="password"
              name="password"
              placeholder="Enter you password"
            />
          </div>
          <div className="flex flex-row-reverse mt-4 gap-4">
            <Button type="submit" className="bg-blue-500 text-white">
              Signup
            </Button>
            <Link to="/signin">
              <Button
                type="button"
                variant={"outline"}
                className="border-blue-500 text-blue-500"
              >
                Signin
              </Button>
            </Link>
          </div>
          {error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4">{error}</p>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
