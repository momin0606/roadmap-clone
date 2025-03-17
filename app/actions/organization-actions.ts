import { createBrowserClient } from "@supabase/ssr";
import type { CreateOrganizationSchemaType } from "~/lib/validators/organizationValidators";
import { v4 as uuidv4 } from "uuid";
import { OrgRoles } from "constants/organization-contants";

export const createOrgAction = async (data: CreateOrganizationSchemaType) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const userResponse = await supabase.auth.getUser();
  console.log({ userResponse });

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("id", userResponse?.data?.user?.id);
    if (!user?.data?.length) {
      throw new Error("Unauthorized");
    }
    let orgId = uuidv4();

    let orgResonse = await supabase.from("Organization").insert({
      id: orgId,
      name: data.name,
      slug: data.name.toLowerCase().replace(" ", "-"),
    });
    if (orgResonse.error) {
      throw new Error(orgResonse.error.message);
    }
    const userOrgResponse = await supabase.from("OrganizationUser").insert({
      id: uuidv4(),
      userId: userResponse?.data?.user?.id,
      organizationId: orgId,
      role: OrgRoles.OWNER,
      active: true,
    });
    if (userOrgResponse.error) {
      throw new Error(userOrgResponse.error.message);
    }
    const organizationDetails = await supabase
      .from("Organization")
      .select("*")
      .eq("id", orgId);
    if (!organizationDetails?.data?.length) {
      throw new Error("Organization not found");
    }
    const boardId = uuidv4();
    const boardResponse = await supabase.from("Board").insert({
      id: boardId,
      organizationId: orgId,
      name: "Untitled Board",
      slug: "untitled-board",
    });
    if (boardResponse.error) {
      throw new Error(boardResponse.error.message);
    }

    const statusesResponse = await supabase.from("Status").insert([
      { id: uuidv4(), boardId: boardId, name: "Backlog", order: 0 },
      { id: uuidv4(), boardId: boardId, name: "In Progress", order: 1 },
      { id: uuidv4(), boardId: boardId, name: "Done", order: 2 },
    ]);
    if (statusesResponse.error) {
      throw new Error(statusesResponse.error.message);
    }

    return { success: true, data: organizationDetails?.data?.[0] };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};
