import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  register: async (params) => {
    if (params?.providerName) {
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Social sign up is not configured for this application.",
        },
      };
    }

    const email = typeof params?.email === "string" ? params.email : "";
    const password = typeof params?.password === "string" ? params.password : "";
    const name = typeof params?.name === "string" ? params.name.trim() : "";
    const role = params?.role;
    const image = typeof params?.image === "string" ? params.image : undefined;
    const imageCldPubId =
      typeof params?.imageCldPubId === "string" ? params.imageCldPubId : undefined;

    if (!email || !password || !name || !role) {
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Name, email, password, and role are required.",
        },
      };
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: "Registration failed",
            message:
              error?.message || "Unable to create account. Please try again.",
          },
        };
      }

      if (!data?.user) {
        return {
          success: false,
          error: {
            name: "Registration failed",
            message: "Registration completed without a user session.",
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },
  login: async (params) => {
    if (params?.providerName) {
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Social sign in is not configured for this application.",
        },
      };
    }

    const email = typeof params?.email === "string" ? params.email : "";
    const password = typeof params?.password === "string" ? params.password : "";

    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Email and password are required.",
        },
      };
    }

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        console.error("Login error from auth client:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: error?.message || "Please try again later.",
          },
        };
      }

      if (!data?.user) {
        return {
          success: false,
          error: {
            name: "Login failed",
            message: "Login completed without a user session.",
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Please try again later.",
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const user = localStorage.getItem("user");

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };
  },
  getPermissions: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      role: parsedUser.role,
    };
  },
  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      image: parsedUser.image,
      role: parsedUser.role,
      imageCldPubId: parsedUser.imageCldPubId,
    };
  },
};