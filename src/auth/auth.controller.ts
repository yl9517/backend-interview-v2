import { Body, Controller, Post } from '@nestjs/common';
import { ResponseUtil } from 'src/common/util/response.util';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const token = await this.authService.signToken(loginUserDto);
    return ResponseUtil.success({ token });
  }
}
