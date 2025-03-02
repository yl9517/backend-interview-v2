import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../auth/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    //이메일 중복확인
    const existUser = await this.userRepository.findOne({ where: { email } });

    if (existUser) {
      throw new BadRequestException('이미 존재하는 회원입니다.');
    }

    //암호화
    const saltForPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltForPassword);

    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }
    return user;
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }
}
