import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseSupabaseService } from './services/base-supabase.service';
import { SupabaseAuthService } from './services/supabase-auth.service';
import { SupabaseStorageService } from './services/supabase-storage.service';

@Global()
@Module({
  imports: [ConfigModule],
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