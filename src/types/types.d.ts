type Identity = {
    id: string;
    user_id: string;
    identity_data: Record<string, any>;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
};

type UserMetadata = {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    preferred_username: string;
    provider_id: string;
    sub: string;
    user_name: string;
}

export type SupabaseUser = {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
        provider: string;
        providers: string[]; // Aquí se asume que el array contiene strings
    };
    user_metadata: UserMetadata;
    identities: Array<Identity>;
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
};
  