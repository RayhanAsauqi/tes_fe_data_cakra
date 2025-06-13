export interface Article {
    id: number;
    documentId: string;
    title: string;
    description: string;
    cover_image_url: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export type CreateArticlePayload = {
    title: string;
    description: string;
    cover_image_url: string;
    category: number;
};
