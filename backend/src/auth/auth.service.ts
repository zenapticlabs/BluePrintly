import { Injectable } from '@nestjs/common';
import { SupabaseAuthService } from '../shared/services/supabase-auth.service';
import { UserRegistrationDto } from './dto/user-registration.dto';

@Injectable()
export class AuthService {
    constructor(private supabaseAuthService: SupabaseAuthService) { }

    async signUp(data: UserRegistrationDto) {
        return this.supabaseAuthService.signUp(data);
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
