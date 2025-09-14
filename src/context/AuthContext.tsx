"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";

export enum Role {
  YDM_Logistics = "YDM_Logistics",
  YDM_Rider = "YDM_Rider",
  YDM_Operator = "YDM_Operator",
}

export const roleMap = {
  [Role.YDM_Logistics]: "Logistics",
  [Role.YDM_Rider]: "Rider", 
  [Role.YDM_Operator]: "Operator",
};

// Helper function to get role-based dashboard route
export const getRoleDashboardRoute = (role: Role): string => {
  switch (role) {
    case Role.YDM_Rider:
      return "/ydm-rider/dashboard";
    case Role.YDM_Logistics:
    case Role.YDM_Operator:
      return "/dashboard";
    default:
      return "/dashboard";
  }
};

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: Role;
  is_active: boolean;
  distributor: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (returnTo?: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  requireAuth: (returnTo: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not set. Auth requests will fail until it is configured."
    );
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const resp = await fetch(`${baseUrl}/api/account/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) throw new Error("Failed to fetch profile");
        const data: User = await resp.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requireAuth = (returnTo: string) => {
    if (!user && !isLoading) {
      const encodedReturnTo = encodeURIComponent(returnTo);
      router.push(`/login?returnTo=${encodedReturnTo}`);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const authResp = await fetch(`${baseUrl}/api/account/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: credentials.phoneNumber,
          password: credentials.password,
        }),
      });
      if (!authResp.ok) throw new Error("Login failed");
      const { access, refresh }: AuthResponse = await authResp.json();

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const profileResp = await fetch(`${baseUrl}/api/account/profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!profileResp.ok) throw new Error("Failed to fetch profile");
      const profile: User = await profileResp.json();
      setUser(profile);

      // Redirect to role-based dashboard after successful login
      const dashboardRoute = getRoleDashboardRoute(profile.role);
      router.push(dashboardRoute);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  };

  const logout = (returnTo?: string) => {
  setUser(null);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  const redirectUrl = returnTo
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : "/login";
  router.replace(redirectUrl); 
};


  const updateProfile = async (data: Partial<User>) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");
      const resp = await fetch(`${baseUrl}/api/account/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Failed to update profile");
      const updated: User = await resp.json();
      setUser(updated);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        isLoading,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
