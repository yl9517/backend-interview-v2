import { Body, Controller, Post } from '@nestjs/common';
import { ResponseUtil } from 'src/common/util/response.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/user/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);

    return ResponseUtil.success();
  }
}
