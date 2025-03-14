import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @MessagePattern({ cmd: 'findOneByEmail' })
  // async findOneByEmail(email: string): Promise<{ id: string }> {
  //   const user = await this.userService.findOneByEmail(email);
  //   return { id: user?.id || null };
  // }

  @GrpcMethod('UserService', 'FindOneByEmail')
  async findOneByEmail(data: { email: string }, metadata: any): Promise<{ id: string }> {
    console.log('nnnnnnnnnnnnnnnnnnn');
    const user = await this.userService.findOneByEmail(data.email);
    return { id: user?.id || null };
  }

  // @MessagePattern({ cmd: 'create' })
  // async create({
  //   email,
  //   password,
  // }: {
  //   email: string;
  //   password: string;
  // }): Promise<{ id: string }> {
  //   const user = await this.userService.create(email, password);
  //   return { id: user.id };
  // }



  @GrpcMethod('UserService', 'CreateUser')
  async createUser(
    data: { email: string; password: string },
    metadata: any,
  ): Promise<{ id: string }> {
    console.log('1111111111111111111111111111');
    console.log('1111111111111111111111111111');
    console.log('1111111111111111111111111111');
    const user = await this.userService.create(data.email, data.password);
    return { id: user.id };
  }

  

  @MessagePattern({ cmd: 'validate' })
  async validate({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    const { id } = await this.userService.validate(email, password);
    return { id };
  }

}
