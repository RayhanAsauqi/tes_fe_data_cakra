import { create } from "zustand";
import { API_URL } from "../constants/api-url";
import { Cookies } from "react-cookie";
import toast from "react-hot-toast";

type CommentStore = {
    loading: boolean;
    error: string | null;
    addComment: (content: string, articleId: number) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
};

const cookies = new Cookies();
const token = cookies.get("token");

export const useCommentStore = create<CommentStore>((set) => ({
    loading: false,
    error: null,

    addComment: async (content: string, articleId: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${atob(token)}`,
                },
                body: JSON.stringify({
                    data: {
                        content,
                        article: articleId,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add comment");
            }

            toast.success("Comment added successfully!");

            set({ loading: false });
        } catch (error) {
            console.error("Error adding comment:", error);
            set({
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to add comment",
            });
        }
    },

    deleteComment: async (commentId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${atob(token)}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to delete comment"
                );
            }

            set({ loading: false });
        } catch (error) {
            console.error("Error deleting comment:", error);
            set({
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete comment",
            });
        }
    },
}));
