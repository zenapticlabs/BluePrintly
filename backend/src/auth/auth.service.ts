import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../shared/services/supabase.service';

@Injectable()
export class AuthService {
    constructor(private supabaseService: SupabaseService) { }

    async signUp(email: string, password: string) {
        return this.supabaseService.signUp(email, password);
    }

    async signIn(email: string, password: string) {
        return this.supabaseService.signIn(email, password);
    }

    async signOut(token: string) {
        return this.supabaseService.signOut(token);
    }

    async getUserById(userId: string) {
        return this.supabaseService.getUserById(userId);
    }
}
