import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from './dto/credentials.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userRepository.createUser(createUserDto);
    } catch (e) {
      throw e;
    }
  }

  signIn(credentialsDto: CredentialsDto): Promise<{ accessToken: string }> {
    try {
      return this.userRepository.signIn(credentialsDto);
    } catch (e) {
      throw e;
    }
  }
}
