const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        const token = this.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                statusCode: response.status,
                message: response.statusText,
            }));
            throw error;
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // Auth
    async register(data: { email: string; name: string; password: string }) {
        return this.request<{
            user: { id: string; email: string; name: string };
            accessToken: string;
            refreshToken: string;
        }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: { email: string; password: string }) {
        return this.request<{
            user: { id: string; email: string; name: string };
            accessToken: string;
            refreshToken: string;
        }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMe() {
        return this.request<{ user: { id: string; email: string; name: string } }>(
            '/auth/me',
            { method: 'POST' },
        );
    }

    // Blogs (auth required)
    async getMyBlogs() {
        return this.request<
            Array<{
                id: string;
                title: string;
                slug: string;
                content: string;
                isPublished: boolean;
                createdAt: string;
                updatedAt: string;
                _count: { likes: number; comments: number };
            }>
        >('/blogs');
    }

    async createBlog(data: {
        title: string;
        content: string;
        isPublished?: boolean;
    }) {
        return this.request('/blogs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getBlog(id: string) {
        return this.request<{
            id: string;
            title: string;
            slug: string;
            content: string;
            isPublished: boolean;
            createdAt: string;
            updatedAt: string;
            _count: { likes: number; comments: number };
        }>(`/blogs/${id}`);
    }

    async updateBlog(
        id: string,
        data: { title?: string; content?: string; isPublished?: boolean },
    ) {
        return this.request(`/blogs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteBlog(id: string) {
        return this.request(`/blogs/${id}`, { method: 'DELETE' });
    }

    // Public
    async getFeed(page: number = 1, limit: number = 10) {
        return this.request<{
            data: Array<{
                id: string;
                title: string;
                slug: string;
                content: string;
                summary: string | null;
                createdAt: string;
                user: { id: string; name: string; email: string };
                _count: { likes: number; comments: number };
            }>;
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        }>(`/public/feed?page=${page}&limit=${limit}`);
    }

    async getBlogBySlug(slug: string) {
        return this.request<{
            id: string;
            title: string;
            slug: string;
            content: string;
            summary: string | null;
            isPublished: boolean;
            createdAt: string;
            updatedAt: string;
            user: { id: string; name: string; email: string };
            _count: { likes: number; comments: number };
        }>(`/public/blogs/${slug}`);
    }

    // Likes
    async likeBlog(blogId: string) {
        return this.request<{ liked: boolean; likeCount: number }>(
            `/blogs/${blogId}/like`,
            { method: 'POST' },
        );
    }

    async unlikeBlog(blogId: string) {
        return this.request<{ liked: boolean; likeCount: number }>(
            `/blogs/${blogId}/like`,
            { method: 'DELETE' },
        );
    }

    // Comments
    async getComments(blogId: string, page: number = 1) {
        return this.request<{
            data: Array<{
                id: string;
                content: string;
                createdAt: string;
                user: { id: string; name: string; email: string };
            }>;
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        }>(`/blogs/${blogId}/comments?page=${page}`);
    }

    async createComment(blogId: string, data: { content: string }) {
        return this.request<{
            id: string;
            content: string;
            createdAt: string;
            user: { id: string; name: string; email: string };
        }>(`/blogs/${blogId}/comments`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const api = new ApiClient();
