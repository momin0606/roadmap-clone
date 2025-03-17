import { createBrowserClient } from "@supabase/ssr";
import type {
  ForgotPasswordSchemaType,
  SignInSchemaType,
  SignUpSchemaType,
  UpdatePasswordSchemaType,
} from "~/lib/validators/authValidators";

export const signUpAction = async (data: SignUpSchemaType) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);
    if (user?.data?.length) {
      throw new Error("User already exists");
    }
    const response = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    let addRes = await supabase.from("users").insert({
      id: response.data.user?.id,
      email: data?.email,
      name: data.name,
    });
    if (addRes.error) {
      throw new Error(addRes.error.message);
    }
    let newUser = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);

    return { success: true, data: newUser?.data?.[0] };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};

export const signInAction = async (data: SignInSchemaType) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);
    if (!user?.data?.length) {
      throw new Error("User doesn't exists");
    }
    let response = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (response.error) {
      throw new Error(response.error.message);
    }
    const loggedUser = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);

    return {
      success: true,
      data: loggedUser?.data?.[0],
    };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};

export const forgotPasswordAction = async (data: ForgotPasswordSchemaType) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);
    if (!user?.data?.length) {
      throw new Error("User doesn't exists");
    }
    let res = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: "http://localhost:3000/updatePassword",
    });
    if (res.error) {
      throw new Error(res.error.message);
    }
    return { success: true, data: { email: data.email } };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};

export const updatePasswordAction = async (data: {
  password: string;
  email: string;
  refreshToken: string;
}) => {
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const newSession = await supabase.auth.refreshSession({
    refresh_token: data.refreshToken,
  });
  console.log({ newSession });

  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);
    if (!user?.data?.length) {
      throw new Error("User doesn't exists");
    }
    let response = await supabase.auth.updateUser({ password: data.password });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return { success: true, data: { email: data.email } };
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.message);
  }
};
