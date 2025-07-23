import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseSupabaseService } from './services/base-supabase.service';
import { SupabaseAuthService } from './services/supabase-auth.service';
import { SupabaseStorageService } from './services/supabase-storage.service';
import { Company } from '../entities/company.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Company])
  ],
  providers: [
    BaseSupabaseService,
    SupabaseAuthService,
    SupabaseStorageService
  ],
  exports: [
    BaseSupabaseService,
    SupabaseAuthService,
    SupabaseStorageService
  ]
})
export class SharedModule {}