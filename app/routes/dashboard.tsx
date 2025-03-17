import { NavLink, Outlet, redirect, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { getServerClient } from "~/server";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();
  if (!userResponse?.data?.user) {
    redirect("/signin");
  }
  const organizations = await sbServerClient
    .from("OrganizationUser")
    .select("*, Organization(*)")
    .eq("userId", userResponse?.data?.user?.id || "");
  if (!organizations?.data?.length) {
    return redirect("/onboarding");
  }

  if (userResponse?.data?.user) {
    return {
      user: userResponse.data.user,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      },
    };
  }
}

const Dashboard = () => {
  return (
    <>
      <nav className="flex flex-row gap-0 border-b-2 border-gray-600">
        <NavLink to="feedback" end>
          {({ isActive }) => {
            return (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="rounded-b-none"
              >
                Feedback
              </Button>
            );
          }}
        </NavLink>
        <NavLink to="roadmap" end>
          {({ isActive }) => {
            return (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="rounded-b-none"
              >
                Roadmap
              </Button>
            );
          }}
        </NavLink>
        <NavLink to="changelog" end>
          {({ isActive }) => {
            return (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="rounded-b-none"
              >
                Changelog
              </Button>
            );
          }}
        </NavLink>
        <NavLink to="help-center" end>
          {({ isActive }) => {
            return (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="rounded-b-none"
              >
                Help Center
              </Button>
            );
          }}
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
};

export default Dashboard;
