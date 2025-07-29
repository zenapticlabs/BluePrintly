import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSupabaseService } from './base-supabase.service';
import { Company } from '../../entities/company.entity';
import { ConfigService } from '@nestjs/config';
import { UserRegistrationDto } from 'src/auth/dto/user-registration.dto';

@Injectable()
export class SupabaseAuthService extends BaseSupabaseService {
    constructor(
        protected readonly configService: ConfigService,
    ) {
        super(configService);
    }

    async signUp(data: UserRegistrationDto) {
        // First create the auth user
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                }
            }
        });
        if (authError) throw authError;

        return authData;
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
        const { data: userData, error: userError } = await this.supabase.auth.admin.getUserById(userId);
        if (userError) throw userError;
        return userData;
    }
}