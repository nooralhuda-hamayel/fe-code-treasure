export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    user_type: 'ADMIN' | 'PLAYER';
    is_deleted: 0 | 1;
};

export type GetMeResponse = {
    user: User;
}; 