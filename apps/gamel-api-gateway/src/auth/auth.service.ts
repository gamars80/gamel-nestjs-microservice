import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { RefreshToken } from './entity/refresh-token.entity';
import { UserServiceGrpc } from './user.service.grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private userServiceGrpc: UserServiceGrpc;
  
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    // gRPC client로부터 UserService 인터페이스를 가져옵니다.
    // this.userServiceGrpc = this.userClient.getService<UserServiceGrpc>('UserService');
    this.userServiceGrpc = this.userClient.getService<UserServiceGrpc>('UserService');
  }

  async signup(email: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let error;
    try {
  
      // const userId = await this.userService.findOneByEmail(email);
      const userId = await firstValueFrom(
        this.userServiceGrpc.findOneByEmail({ email }, {})
      );
      
      // 이미 존재하는 사용자가 있다면 에러 발생
      if (userId && userId.id) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      console.log('dddddddddddddddddd');
      // const newUserId = await this.userService.create(email, password);
      // const newUser = await this.userServiceGrpc.create({ email, password }, {})
      const newUser = await firstValueFrom(
        this.userServiceGrpc.createUser({ email, password }, {})
      );
      console.log('eeeeeeeeeeeeeeeee');
      console.log('eeeeeeeeeeeeeeeee');
      const accessToken = this.genereateAccessToken(newUser.id);
      const refreshTokenEntity = queryRunner.manager.create(RefreshToken, {
        userId: newUser.id,
        token: this.genereateRefreshToken(newUser.id),
      });

      
      queryRunner.manager.save(refreshTokenEntity);
      await queryRunner.commitTransaction();
      return {
        id: newUser.id,
        accessToken,
        refreshToken: refreshTokenEntity.token,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async signin(email: string, password: string) {
    const userId = await this.userService.validateUser(email, password);

    const refreshToken = this.genereateRefreshToken(userId);
    await this.createRefreshTokenUsingUser(userId, refreshToken);
    return {
      accessToken: this.genereateAccessToken(userId),
      refreshToken,
    };
  }

  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      token,
    });
    if (!refreshTokenEntity) throw new BadRequestException();
    const accessToken = this.genereateAccessToken(userId);
    const refreshToken = this.genereateRefreshToken(userId);
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return { accessToken, refreshToken };
  }

  private genereateAccessToken(userId: string) {
    const payload = { sub: userId, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private genereateRefreshToken(userId: string) {
    const payload = { sub: userId, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private async createRefreshTokenUsingUser(
    userId: string,
    refreshToken: string,
  ) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      userId,
    });
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        userId,
        token: refreshToken,
      });
    }
    await this.refreshTokenRepository.save(refreshTokenEntity);
  }
}
