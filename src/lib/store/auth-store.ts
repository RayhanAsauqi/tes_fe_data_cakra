import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { API_URL } from "../constants/api-url";
import toast from "react-hot-toast";
import { Cookies } from "react-cookie";
import type { FormDataLogin, FormDataRegister, User } from "../types/auth";

const cookies = new Cookies();

type AuthState = {
    loading: boolean;
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    signIn: (values: FormDataLogin) => Promise<void>;
    signUp: (values: FormDataRegister) => Promise<void>;
    getMe: () => Promise<void>;
    clearAuth: () => void;
};

export const AuthStore = create<AuthState>()(
    devtools((set, get) => ({
        loading: false,
        user: null,
        token: cookies.get("token") || null,
        isAuthenticated: false,

        setIsAuthenticated: (value) => set({ isAuthenticated: value }),
        signIn: async (values) => {
            set({ loading: true });
            try {
                const res = await fetch(`${API_URL}/auth/local`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                if (!res.ok) {
                    throw new Error("Identifier or password is incorrect");
                }

                const data = await res.json();
                const token = btoa(data.jwt);

                cookies.set("token", token, {
                    path: "/",
                    maxAge: 2 * 24 * 60 * 60,
                    sameSite: "lax",
                });

                set({ token, isAuthenticated: !!btoa(data.jwt) });
                await get().getMe();

                toast.success("Login successful!", {
                    position: "bottom-right",
                });
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { position: "bottom-right" });
                }
            } finally {
                set({ loading: false });
            }
        },

        signUp: async (values) => {
            set({ loading: true });
            try {
                const res = await fetch(`${API_URL}/auth/local/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.error?.message || "Failed to register user"
                    );
                }

                toast.success("Registration successful!", {
                    position: "bottom-right",
                });
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { position: "bottom-right" });
                }
            } finally {
                set({ loading: false });
            }
        },

        getMe: async () => {
            const { token } = get();
            if (!token) {
                set({ user: null });
                return;
            }

            set({ loading: true });
            try {
                const res = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${atob(token)}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const userData = await res.json();
                set({ user: userData, isAuthenticated: true });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                set({ user: null });
                cookies.remove("token");
            } finally {
                set({ loading: false });
            }
        },

        clearAuth: () => {
            cookies.remove("token");
            set({ user: null, token: null });
        },
    }))
);
