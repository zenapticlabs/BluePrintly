import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signup')
    async signup(@Body() body: { email: string; password: string }) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('signin')
    async signin(@Body() body: { email: string; password: string }) {
        return this.authService.signin(body.email, body.password);
    }

    @Post('signout')
    async signout(@Headers('Authorization') token: string) {
        return this.authService.signout(token);
    }
}
