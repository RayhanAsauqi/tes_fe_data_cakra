export type FormDataLogin = {
    identifier: string;
    password: string;
};

export type FormDataRegister = {
    email: string;
    username: string;
    password: string;
};

export type User = {
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
    locale: null | string;
};

export type CookieOptions = {
    path?: string;
    maxAge?: number;
    expires?: Date;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
};
