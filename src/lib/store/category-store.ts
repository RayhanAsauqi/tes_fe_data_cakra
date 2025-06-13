import { create } from "zustand";
import type { Category } from "../types/category";
import { API_URL } from "../constants/api-url";
import toast from "react-hot-toast";

type ArticleCategoryState = {
    articleCategories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchArticleCategories: () => Promise<void>;
};

export const useArticleCategoryStore = create<ArticleCategoryState>((set) => ({
    articleCategories: [],
    isLoading: false,
    error: null,
    fetchArticleCategories: async () => {
        set({ isLoading: true, error: null });

        try {
            const res = await fetch(`${API_URL}/categories`);

            if (!res.ok) {
                throw new Error(`Failed to fetch categories: ${res.status}`);
            }

            const json = await res.json();

            if (!json.data || !json.meta?.pagination) {
                throw new Error("Invalid API response structure");
            }

            set({
                articleCategories: json.data,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch articles";

            set({
                isLoading: false,
                error: errorMessage,
                articleCategories: [],
            });

            toast.error(errorMessage, { position: "bottom-right" });
        }
    },
}));
