"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('postgres', () => ({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5434,
    database: process.env.POSTGRES_DATABASE || 'user-service',
    username: process.env.POSTGRES_USERNAME || 'user-service',
    password: process.env.POSTGRES_PASSWORD || 'user-service',
}));
//# sourceMappingURL=postgres.config.js.map