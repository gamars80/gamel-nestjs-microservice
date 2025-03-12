import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: 'user-service',
  //       port: 3001,
  //     },
  //   },
  // );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user', // proto 파일의 package와 일치해야 합니다.
      protoPath: join(__dirname, '../protos/user.proto'),
      url: '0.0.0.0:50051', // gRPC 서버가 바인딩할 주소
    },
  });
  await app.listen();
  console.info(`user-service listening on 3001 for TCP`);
}

bootstrap();
