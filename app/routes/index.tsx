import { Outlet, type MetaFunction } from "react-router";
import { getServerClient } from "~/server";
import type { Route } from "./+types";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();

  if (userResponse?.data?.user) {
    return { user: userResponse.data.user };
  }

  return {
    user: null,
  };
};

export default function Index({ loaderData }: Readonly<Route.ComponentProps>) {
  return (
    <div>
      <Outlet />
    </div>
  );
}
