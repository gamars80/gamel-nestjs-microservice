"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'user',
            protoPath: (0, path_1.join)(__dirname, './protos/user.proto'),
            url: '0.0.0.0:50051',
        },
    });
    await app.listen();
    console.info(`user-service listening on 3001 for TCP`);
}
bootstrap();
//# sourceMappingURL=main.js.map