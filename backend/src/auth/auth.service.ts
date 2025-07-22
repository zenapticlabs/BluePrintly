import { Injectable } from '@nestjs/common';
import { SupabaseAuthService } from '../shared/services/supabase-auth.service';

@Injectable()
export class AuthService {
    constructor(private supabaseAuthService: SupabaseAuthService) { }

    async signUp(email: string, password: string) {
        return this.supabaseAuthService.signUp(email, password);
    }

    async signIn(email: string, password: string) {
        return this.supabaseAuthService.signIn(email, password);
    }

    async signOut(token: string) {
        return this.supabaseAuthService.signOut(token);
    }

    async getUserById(userId: string) {
        return this.supabaseAuthService.getUserById(userId);
    }
}
