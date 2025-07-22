import { Injectable } from '@nestjs/common';
import { BaseSupabaseService } from './base-supabase.service';

@Injectable()
export class SupabaseAuthService extends BaseSupabaseService {
    async signUp(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async signOut(token: string) {
        const { error } = await this.supabase.auth.admin.signOut(token);
        if (error) throw error;
    }

    async getUserById(userId: string) {
        const { data, error } = await this.supabase.auth.admin.getUserById(userId);
        if (error) throw error;
        return data;
    }
} 