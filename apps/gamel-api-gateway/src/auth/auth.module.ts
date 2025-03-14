import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('jwt.secret'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    ClientsModule.register([
      {
        // gRPC 클라이언트로서 User 마이크로서비스를 호출합니다.
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          // Docker Compose 내에서는 서비스 이름(user-service)을 사용합니다.
          url: 'user-service:50051',
          package: 'user', // proto 파일에 정의된 패키지명과 일치해야 합니다.
          protoPath: join(__dirname, '../../../libs/protos/user.proto'),
        },
      },
    ]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    Logger,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
