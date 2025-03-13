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
    { title: "Sign In" },
    { name: "description", content: "Sign in to your account" },
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

export default function Signin({ loaderData }: Route.ComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const { env } = loaderData;
  const navigate = useNavigate();

  const doSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataFields = Object.fromEntries(formData.entries());
    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });
    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }
    if (data.session) {
      navigate("/home");
    }
  };
  return (
    <div className="p-8 min-2-3/4 w-[500px] mx-auto">
      <h1 className="text-2xl"> Supabase Auth Signin</h1>
      <Form method="post" className="mt-6" onSubmit={doSignin}>
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
              Signin
            </Button>
            <Link to="/signup">
              <Button
                type="button"
                variant={"outline"}
                className="border-blue-500 text-blue-500"
              >
                Signup
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
