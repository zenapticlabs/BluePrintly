import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

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
      entities: [Company],
      synchronize: true, // For dev only! Use migrations in prod.
    }),
    TypeOrmModule.forFeature([Company]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
