import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    console.log('zzzzzzzzzzzzzzzzzzzzzz');
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async create(email: string, password: string) {
    console.log('11111111111111111111');
    console.log('11111111111111111111');
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const userEntity = this.userRepository.create({
      email,
      password: hash,
    });
    console.log('222222222222222222');
    const user = await this.userRepository.save(userEntity);
    return user;
  }

  async validate(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    return user;
  }
}
