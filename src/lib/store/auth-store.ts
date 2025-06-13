import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { API_URL } from "../constants/api-url";
import toast from "react-hot-toast";
import type { FormDataLogin, FormDataRegister } from "../types/auth";

type CookieOptions = {
    path?: string;
    maxAge?: number;
    expires?: Date;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
};

type AuthState = {
    loading: boolean;
    signIn: (
        values: FormDataLogin,
        setCookie: (
            name: "token",
            value: string,
            options: CookieOptions
        ) => void
    ) => Promise<void>;
    signUp: (values: FormDataRegister) => Promise<void>;
};

export const AuthStore = create<AuthState>()(
    devtools((set) => ({
        loading: false,
        signIn: async (values, setCookie) => {
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

                setCookie("token", btoa(data.jwt), {
                    path: "/",
                    maxAge: 2 * 24 * 60 * 60,
                    sameSite: "lax",
                });

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
    }))
);
