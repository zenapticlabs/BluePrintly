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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
      entities: [Company, PastProposal],
      synchronize: true
    }),
    TypeOrmModule.forFeature([Company, PastProposal]),
    OnboardingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
