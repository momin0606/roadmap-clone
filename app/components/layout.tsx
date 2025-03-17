import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/layout";
import { getServerClient } from "~/server";
import { Button } from "./ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { Toaster } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();
  const user = await sbServerClient
    .from("users")
    .select("*")
    .eq("id", userResponse?.data?.user?.id);

  const orgResponse = await sbServerClient
    .from("OrganizationUser")
    .select("*, Organization(*)")
    .eq("userId", userResponse?.data?.user?.id || "");
  const organizations = orgResponse?.data;
  if (userResponse?.data?.user) {
    return {
      user: user.data?.[0],
      organizations: organizations,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      },
    };
  }

  return {
    user: null,
  };
};

const layout = () => {
  const { env, user, organizations } = useLoaderData();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );
    await supabase.auth.signOut();
    navigate("/");
  };
  return (
    <>
      <header className="bg-gray-950">
        <nav className="container mx-auto text-white p-4 flex items-center gap-4 justify-between">
          <NavLink
            to={"/"}
            className={({ isActive }) => {
              return isActive ? "text-blue-300" : "text-white";
            }}
          >
            FeatureBase Road Map
          </NavLink>
          {isLoggedIn ? (
            <div className="flex gap-4 items-center">
              <NavLink
                to={"/dashboard/roadmap"}
                className={({ isActive }) => {
                  return isActive ? "text-blue-300" : "text-white";
                }}
              >
                <Button variant={"secondary"}>Dashboard</Button>
              </NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {" "}
                  <Avatar>
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        ?.map((name: string, index: number) => {
                          return index < 2 ? name?.[0].toUpperCase() : "";
                        })}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-10">
                  <DropdownMenuLabel>My Organizations</DropdownMenuLabel>
                  {organizations?.map((org: any) => {
                    return (
                      <DropdownMenuItem
                        className={
                          org?.active
                            ? "bg-gray-700 hover:bg-gray-700 text-white"
                            : ""
                        }
                        disabled={org.avtive}
                        key={org.id}
                      >
                        {org?.Organization?.name}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <NavLink
                to={"/signin"}
                className={({ isActive }) => {
                  return isActive ? "text-blue-300" : "text-white";
                }}
              >
                Sign In
              </NavLink>
              <NavLink
                to={"/signup"}
                className={({ isActive }) => {
                  return isActive ? "text-blue-300" : "text-white";
                }}
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </nav>
      </header>
      <main className="container mx-auto p-4 min-h-screen">
        <Outlet />
        <Toaster richColors />
      </main>
    </>
  );
};

export default layout;
