import { Injectable } from '@nestjs/common';
import { SupabaseAuthService } from '../shared/services/supabase-auth.service';

interface CompanyDetails {
  name: string;
  type: string;
  industry: string;
  employeeCount: string;
  website: string;
}

interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: CompanyDetails;
}

@Injectable()
export class AuthService {
    constructor(private supabaseAuthService: SupabaseAuthService) { }

    async signUp(data: UserRegistrationData) {
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
