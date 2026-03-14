"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return { success: true, user: result.user, error: null };
  } catch (error) {
    console.error("SignUp error:", error);
    return { 
      success: false, 
      user: null, 
      error: "Erro ao criar conta. Verifique os dados e tente novamente." 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, user: result.user, error: null };
  } catch (error) {
    console.error("SignIn error:", error);
    return { 
      success: false, 
      user: null, 
      error: "Email ou senha incorretos. Verifique suas credenciais." 
    };
  }
};

export const signInSocial = async (provider: "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("GetSession error:", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const result = await auth.api.signOut({ headers: await headers() });
    return result;
  } catch (error) {
    console.error("SignOut error:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Erro ao fazer logout. Tente novamente."
    );
  }
};
