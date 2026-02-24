export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Blog {
    id: string;
    userId: string;
    title: string;
    slug: string;
    content: string;
    summary: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    user?: User;
    _count?: {
        likes: number;
        comments: number;
    };
}

export interface Comment {
    id: string;
    blogId: string;
    userId: string;
    content: string;
    createdAt: string;
    user: User;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface FeedResponse {
    data: Blog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CommentsResponse {
    data: Comment[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface LikeResponse {
    liked: boolean;
    likeCount: number;
}

export interface ApiError {
    statusCode: number;
    message: string | string[];
    timestamp: string;
}
