import { Body, Controller, Headers, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SupabaseStorageService } from 'src/shared/services/supabase-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRegistrationData } from 'src/shared/dto/user-registration.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private supabaseStorage: SupabaseStorageService) { }

    @Post('signup')
    @UseInterceptors(FileInterceptor('logo')) // Assuming you're using Multer for file
    async signup(
        @UploadedFile() logo: Express.Multer.File,
        @Body() body: UserRegistrationData
    ) {
        if (logo) {
            const logoUrl = await this.supabaseStorage.uploadFile(
                logo.buffer,
                logo.originalname,
                'company-logos'
            );
            body.company.logoUrl = logoUrl;
        }
        return this.authService.signUp(body);
    }

    @Post('signin')
    async signin(@Body() body: { email: string; password: string }) {
        return this.authService.signIn(body.email, body.password);
    }

    @Post('signout')
    async signout(@Headers('Authorization') token: string) {
        return this.authService.signOut(token);
    }
}
