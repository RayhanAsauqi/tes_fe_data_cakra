import { create } from "zustand";
import { API_URL } from "../constants/api-url";
import { Cookies } from "react-cookie";
import toast from "react-hot-toast";
import type { Comment } from "../types/article";

type CommentStore = {
    comments: Comment[];
    loading: boolean;
    error: string | null;
    currentArticleId: string | null;
    openCommentsCardId: string | null;
    setComments: (comments: Comment[]) => void;
    fetchComments: (articleId: string) => Promise<void>;
    updateComment: (commentId: string, content: string) => Promise<void>;
    addComment: (
        content: string,
        articleId: number,
        articleDocumentId: string
    ) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    clearComments: () => void;
    setOpenCommentsCard: (cardId: string | null) => void;
    closeAllComments: () => void;
};

const cookies = new Cookies();

export const useCommentStore = create<CommentStore>((set, get) => ({
    comments: [],
    loading: false,
    error: null,
    currentArticleId: null,
    openCommentsCardId: null,

    setComments: (comments: Comment[]) => {
        set({ comments });
    },

    clearComments: () => {
        set({ comments: [], currentArticleId: null });
    },

    setOpenCommentsCard: (cardId: string | null) => {
        set({ openCommentsCardId: cardId });
    },

    closeAllComments: () => {
        set({ openCommentsCardId: null, comments: [], currentArticleId: null });
    },

    fetchComments: async (articleId: string) => {
        set({ loading: true, error: null, currentArticleId: articleId });
        try {
            const token = cookies.get("token");
            const response = await fetch(
                `${API_URL}/comments?filters[article][documentId][$eq]=${articleId}&populate=user&sort=createdAt:desc`,
                {
                    headers: {
                        Authorization: token ? `Bearer ${atob(token)}` : "",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            set({
                comments: data.data || [],
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching comments:", error);
            set({
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch comments",
            });
        }
    },

    addComment: async (
        content: string,
        articleId: number,
        articleDocumentId: string
    ) => {
        set({ loading: true, error: null });
        try {
            const token = cookies.get("token");
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

            await get().fetchComments(articleDocumentId);
        } catch (error) {
            console.error("Error adding comment:", error);
            set({
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to add comment",
            });
            toast.error("Failed to add comment");
        }
    },
    updateComment: async (commentId: string, content: string) => {
        const currentArticleId = get().currentArticleId;
        set({ loading: true, error: null });

        try {
            const token = cookies.get("token");
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${atob(token)}`,
                },
                body: JSON.stringify({
                    data: {
                        content,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update comment"
                );
            }

            toast.success("Comment updated successfully!");

            if (currentArticleId) {
                await get().fetchComments(currentArticleId);
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            set({
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update comment",
            });
            toast.error("Failed to update comment");
        }
    },
    deleteComment: async (commentId: string) => {
        const currentArticleId = get().currentArticleId;
        set({ loading: true, error: null });

        try {
            const token = cookies.get("token");
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

            toast.success("Comment deleted successfully!");

            if (currentArticleId) {
                await get().fetchComments(currentArticleId);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            set({
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete comment",
            });
            toast.error("Failed to delete comment");
        }
    },
}));
