import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signToken(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.usersService.validateUser(loginUserDto);

    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
