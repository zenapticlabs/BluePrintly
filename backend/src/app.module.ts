import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { PastProposal } from './entities/past-proposal.entity';
import { OnboardingModule } from './onboarding/onboarding.module';
import { BullModule } from '@nestjs/bull';
import { FilesModule } from './files/files.module';
import { Portfolio } from './entities/portfolio.entity';
import { OnboardingStatus } from './entities/onboarding-status.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || 'password',
      },
    }),
    SharedModule,
    AuthModule,
    DocumentsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SUPABASE_HOST,
      port: parseInt(process.env.SUPABASE_PORT || "5432", 10),
      username: process.env.SUPABASE_USERNAME,
      password: process.env.SUPABASE_PASSWORD,
      database: process.env.SUPABASE_DATABASE,
      entities: [Company, PastProposal, Portfolio, OnboardingStatus],
      synchronize: true
    }),
    TypeOrmModule.forFeature([Company, PastProposal, Portfolio, OnboardingStatus]),
    OnboardingModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
