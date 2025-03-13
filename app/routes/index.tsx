import type { Route } from "./+types/index";
import { redirect, type MetaFunction } from "react-router";
import { getServerClient } from "~/server";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const sbServerClient = getServerClient(request);
    const userResponse = await sbServerClient.auth.getUser();
    if (!userResponse?.data?.user) {
      throw redirect("/signin");
    } else {
      throw redirect("/home");
    }
  } catch (error) {
    console.error(error);
    throw redirect("/signin");
  }
}
