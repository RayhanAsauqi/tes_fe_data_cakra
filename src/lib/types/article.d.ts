type User = {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: null;
};

export type Category = {
    id: number;
    documentId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
};

type Comment = {
    id: number;
    documentId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: null;
    user: User;
};

export type Article = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    cover_image_url: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    comments: Comment[];
    category: Category;
    user: User;
};

export type CreateArticlePayload = {
    title: string;
    description: string;
    cover_image_url: string;
    category: number;
};
