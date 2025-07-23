import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

interface CompanyDetails {
  name: string;
  type: string;
  industry: string;
  employeeCount: string;
  website: string;
}

interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: CompanyDetails;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @Post('signup')
    async signup(@Body() body: UserRegistrationData) {
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
