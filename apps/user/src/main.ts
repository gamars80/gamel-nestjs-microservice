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
      // proto 파일에 정의된 패키지명과 일치해야 합니다.
      package: 'user',
      // proto 파일의 실제 경로 (모노레포 구조에 맞게 조정)
      protoPath: join(__dirname, '../../libs/protos/user.proto'),
      // 컨테이너 내부에서 모든 인터페이스에 바인딩할 주소
      url: '0.0.0.0:50051',
    },
  });
  await app.listen();
  console.info(`user-service listening on 3001 for gRpc`);
}

bootstrap();
