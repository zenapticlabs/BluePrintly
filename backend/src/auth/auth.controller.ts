import { Body, Controller, Headers, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseStorageService } from 'src/shared/services/supabase-storage.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
    constructor(private authService: AuthService, private supabaseStorage: SupabaseStorageService) { }

    @Post('signup')
    async signup(
        @Body() body: UserRegistrationDto
    ) {
        return this.authService.signUp(body);
    }

    @Post('signin')
    async signin(@Body() body: SignInDto) {
        return this.authService.signIn(body.email, body.password);
    }

    @Post('signout')
    async signout(@Headers('Authorization') token: string) {
        return this.authService.signOut(token);
    }
}
