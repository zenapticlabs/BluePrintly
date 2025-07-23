import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSupabaseService } from './base-supabase.service';
import { Company } from '../../entities/company.entity';
import { ConfigService } from '@nestjs/config';
import { UserRegistrationData } from '../dto/user-registration.dto';

@Injectable()
export class SupabaseAuthService extends BaseSupabaseService {
    constructor(
        protected readonly configService: ConfigService,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) {
        super(configService);
    }

    async signUp(data: UserRegistrationData) {
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

        // Create company profile
        const company = this.companyRepository.create({
            user_id: authData.user?.id,
            name: data.company.name,
            type: data.company.type,
            industry: data.company.industry,
            employee_count: data.company.employeeCount,
            website: data.company.website,
            logo_url: data.company?.logoUrl // Assuming logoUrl is set after file upload
        });
        await this.companyRepository.save(company);

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

        // Get company details
        const { data: companyData, error: companyError } = await this.supabase
            .from('companies')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (companyError) throw companyError;

        return {
            ...userData,
            company: companyData
        };
    }
}